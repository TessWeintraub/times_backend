import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PostsEntity} from "./posts.entity";
import {Repository} from "typeorm";
import {PostsDto} from "./posts.dto";
import * as EasyYandexS3 from "easy-yandex-s3";
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';



@Injectable()
export class PostsService {
    constructor(@InjectRepository(PostsEntity) private postRepository: Repository<PostsEntity>) {}

    async getAll(
      sort: string,
      filter: string,
      search: string,
      options: IPaginationOptions
    ): Promise<Pagination<PostsEntity>>
    {
        // Если с клиента придет какая-либо сортировка, то сортируем от большего к меньшему, иначе от меньшего к большему
        const order = sort !== 'id' ? "DESC" : "ASC"


        if (search && filter){
            const queryBuilder = await this.postRepository.createQueryBuilder('post')
              .where('post.tags @> ARRAY[:...tags]', { tags: filter.split(',') })
              .andWhere('post.title like %:search%', { search: search })
              .orderBy(`${sort}`, `${order}` )

            return await paginate<PostsEntity>( queryBuilder, options )
        }
        if (filter){
            const queryBuilder = await this.postRepository.createQueryBuilder('post')
              .where('post.tags @> ARRAY[:...tags]', { tags: filter.split(',')})
              .orderBy(`${sort}`, `${order}` )

            return await paginate<PostsEntity>( queryBuilder, options )
        }

        if (search){
            const queryBuilder = await this.postRepository.createQueryBuilder('post')
              .where( 'post.title like :search', { search: `%${search}%` })
              .orderBy(`${sort}`, `${order}` )

            return await paginate<PostsEntity>( queryBuilder, options )
        }

        const queryBuilder = await this.postRepository.createQueryBuilder('post')
          .orderBy(`post.${sort}`, `${order}`)
        return await paginate<PostsEntity>( queryBuilder, options )
    }


    // Возвращает уникальные теги(категории) постов
    async tags() {
        const allPosts = await this.postRepository.find()
        const allTags = allPosts.map(post => post.tags).flat()
        const uniqTags = [...new Set(allTags)]
        return (uniqTags)
    }


    async getById(id: number){
        return await this.postRepository.findOne({
            where: {
                id: Number(id)
            }
        })
    }


    async create(dto: PostsDto, file: Express.Multer.File){
        try {
            const post = await this.postRepository.create({
                ...dto,
                imageUrl: await this.uploadImage(file),
                date: Date.now()
            })
            await this.postRepository.save(post)
            return {}
        } catch (e){
            console.log(e)
        }
    }

    async updateById(id: number){
        await this.postRepository.increment({id: id}, 'views_count', 1)
        return {message: 'Обновленно'}
    }


    // На данный момент не используется
    async deleteById(id: number){
        await this.postRepository.delete({id: id})
        return {message: 'Пост удален'}
    }

    // Скорее всего это нужно вынести с сервиса, но не знаю как
    async uploadImage(file){
        const s3 = new EasyYandexS3({
            auth: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
            Bucket: `${process.env.BUCKET}`
        })
        try {
            const upload = await s3.Upload({
                buffer: file.buffer
            },  process.env.BUCKET_DIR );
            return upload.Location
        }
        catch (e) {
            console.log('===>e', e)
        }
    }
}
