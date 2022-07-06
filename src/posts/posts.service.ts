import {Body, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PostsEntity} from "./posts.entity";
import {Repository} from "typeorm";
import {PostsDto} from "./posts.dto";

@Injectable()
export class PostsService {
    constructor(@InjectRepository(PostsEntity) private postRepository: Repository<PostsEntity>) {}

    async getAll(){
        return await this.postRepository.find({order: {id: 1}})
    }

    async tags() {
        const allPosts = await this.getAll()
        const allTags = allPosts.map(post => post.tags).flat()
        const uniqTags = [...new Set(allTags)]
        return (uniqTags)
    }

    async search(search) {
        return await this.postRepository.find({where: {title: search}})
    }

    async getById(id: number){
        return await this.postRepository.findOne({
            where: {
                id: Number(id)
            }
        })
    }

    async filterByTag(filter: string){
        return await this.postRepository
            .createQueryBuilder('post')
            .where('post.tags @> ARRAY[:...tags]', { tags: filter.split(',')})
            .getMany();
    }

    async sortAndFilter(filter: string, sort: string){
        return await this.postRepository
            .createQueryBuilder('post')
            .where('post.tags @> ARRAY[:...tags]', { tags: filter.split(',')})
            .orderBy(`${[sort]}`)
            .getMany();
    }

    async sort(sort: string){
        return await this.postRepository.find({order:{ [sort] : 1}})
    }

    async create(@Body() dto: PostsDto){
        const post = await this.postRepository.create({
            ...dto,
            date: Date.now()
        })
        await this.postRepository.save(post)
        return await this.getAll()
    }

    async updateById(id: number){
        await this.postRepository.increment({id: id}, 'views_count', 1)
        return await this.getAll()
    }

    async deleteById(id: number){
        await this.postRepository.delete({id: id})
        return await this.getAll()
    }
}
