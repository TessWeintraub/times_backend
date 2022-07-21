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
import { UsersEntity } from "../users/users.entity";


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
  ): Promise<Pagination<PostsEntity>> {
    const order = sort !== "id" ? "DESC" : "ASC";

    const tags = filter ? filter.split(",") : await this.tags();

    const queryBuilder = await this.postRepository.createQueryBuilder("post")
      .orderBy(`post.${sort}`, `${order}`)
      .leftJoinAndSelect('post.author', 'users')
      .where("lower(post.title) like :search", { search: `%${search}%` })
      .andWhere("post.tags && ARRAY[:...tags]", { tags: tags });
    return await paginate<PostsEntity>(queryBuilder, options);
  }

  // Возвращает уникальные теги(категории) постов
  async tags() {
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
      relations: ['Users']
    });
  }

  async create(dto: CreatePostsDto, file: Express.Multer.File, userInfo) {
    const user = await this.usersService.getUserByEmail(userInfo.email);
    try {
      const post = await this.postRepository.create({
        ...dto,
        imageUrl: await this.fileService.uploadImage(file),
        author: user,
        date: Date.now()
      });
      await this.postRepository.save(post);
      return post;
    } catch (e) {
      console.log(e);
    }
  }

  async updateById(id: SearchIdPostDto) {
    await this.postRepository.increment({ id: Number(id) }, "views_count", 1);
    return { message: "Обновленно" };
  }

  // На данный момент не используется
  async deleteById(id: DeleteIdPostDto) {
    await this.postRepository.delete({ id: Number(id) });
    return { message: "Пост удален" };
  }
}
