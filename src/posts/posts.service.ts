import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostsEntity } from "./posts.entity";
import { Repository } from "typeorm";
import { CreatePostsDto } from "./dto/createPosts.dto";
import { FilesService } from "../files/files.service";
import { SearchIdPostDto } from "./dto/searchIdPost.dto";
import { DeleteIdPostDto } from "./dto/deleteIdPost.dto";
import {
  paginate,
  Pagination,
  IPaginationOptions
} from "nestjs-typeorm-paginate";
import { UsersService } from "../users/users.service";


@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity) private postRepository: Repository<PostsEntity>,
    private fileService: FilesService,
    private usersService: UsersService,
  ) {
  }

  async getAll(
    sort: string,
    filter: string,
    search: string,
    options: IPaginationOptions
  )
      : Promise<Pagination<PostsEntity>>
  {
    const order = sort !== "id" ? "DESC" : "ASC";

    const tags = filter ? filter.split(",") : await this.tags();

    const queryBuilder = await this.postRepository.createQueryBuilder("post")
      .orderBy(`post.${sort}`, `${order}`)
      .leftJoinAndSelect('post.author', 'users')
      .where("lower(post.title) like :search", { search: `%${search}%` })
      .andWhere("post.tags && ARRAY[:...tags]", { tags: tags })

    const test = await this.postRepository.query(`
    SELECT
    post.* ,
    ARRAY_LENGTH("post"."tags", 1) AS "views_count"
    FROM "PostsEntity" as "post"
     LEFT OUTER JOIN "UsersEntity" ON "UsersEntity"."id"="post"."author"
    WHERE lower("post"."title") like '%${search}%' ORDER BY "post"."id" ASC
    `)
    console.log(test)
   return await paginate(queryBuilder, options)
  }

  // Возвращает уникальные теги(категории) постов+
  async tags() {
     // const test3 = await  this.postRepository.query(`
     // SELECT ARRAY(SELECT DISTINCT UNNEST(posts.tags) FROM posts ) as tags
     // `)
    const test = await this.postRepository.query(`
    SELECT "posts".*, "UsersEntity"."id" as "author_id"  FROM "PostsEntity" as "posts" LEFT OUTER JOIN "UsersEntity" ON "UsersEntity"."id" = "posts"."author"
    `)
    console.log(test)
    const allPosts = await this.postRepository.find();
    const allTags = allPosts.map(post => post.tags).flat();
    const uniqTags = [...new Set(allTags)];
    return (uniqTags);
  }

  async getById(id: SearchIdPostDto) {
    return await this.postRepository.findOne({
      where: {
        id: Number(id)
      },
      relations: {
        author: true
      },
      select: {
        author: {
          id: true,
          first_name: true,
          last_name: true,
          avatar_url: true
        },
      }
    });
  }

  async create(dto: CreatePostsDto, file: Express.Multer.File, userInfo) {
    const user = await this.usersService.getUserByEmail(userInfo.email);
    try {
      const post = await this.postRepository.create({
        ...dto,
        image_url: await this.fileService.uploadImage(file),
        author: user,
        date: Date.now()
      });
      await this.postRepository.save(post);
      return post;
    } catch (e) {
      console.log(e);
    }
  }

  async updateById(id: SearchIdPostDto, userId: number) {
    const oldViewsCount = await this.postRepository.createQueryBuilder('post')
        .select('post.viewed_users')
        .where(`post.id = ${id}`)
        .getOne()

    const extendsUserId = oldViewsCount.viewed_users.find( id => id === userId && true)

    if (!extendsUserId) {
      await this.postRepository.update({id: Number(id)}, {
        viewed_users: [...oldViewsCount.viewed_users, userId],
        views_count: ++oldViewsCount.viewed_users.length
      })
    }
    return { message: "Обновленно" };
  }

  // На данный момент не используется
  async deleteById(id: DeleteIdPostDto) {
    await this.postRepository.delete({ id: Number(id) });
    return { message: "Пост удален" };
  }
}
