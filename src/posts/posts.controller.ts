import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors
}
from "@nestjs/common";
import {PostsService} from "./posts.service";
import {FileInterceptor} from "@nestjs/platform-express";
import { Pagination } from 'nestjs-typeorm-paginate';
import { PostsEntity } from "./posts.entity";

@Controller('posts')
export class PostsController {
    constructor(private  readonly  postsService: PostsService) {}

    @Get()
    async getAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number = 6,
        @Query('sort', new DefaultValuePipe('id')) sort: string,
        @Query('filter') filter: string,
        @Query('search') search: string
    ): Promise<Pagination<PostsEntity>>{
        return this.postsService.getAll(sort, filter, search,{page, limit})
    }

    // Вернет список категорий
    @Get('/tags')
    async getTags(){
        return this.postsService.tags()
    }

    // Отдать пост по id
    @Get(':id')
    async getById(@Param('id') id: string){
        return this.postsService.getById(Number(id))
    }

    // Создание поста, принимает файл и данные о посте
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body('body') dto: string, @UploadedFile() file: Express.Multer.File){
        return this.postsService.create(JSON.parse(dto), file)
    }

    // Обновление количества просмотров
    @Patch(':id')
    async updateById(@Param('id') id: string){
        return this.postsService.updateById(Number(id))
    }

    // Удаление поста, сейчас не используется
    @Delete(':id')
    async deleteById(@Param('id') id: string){
        return this.postsService.deleteById(Number(id))
    }
}
