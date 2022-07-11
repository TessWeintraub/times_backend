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
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreatePostsDto } from "./dto/createPosts.dto";
import { SearchIdPostDto } from "./dto/searchIdPost.dto";
import { DeleteIdPostDto } from "./dto/deleteIdPost.dto";
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";

@Controller('posts')
export class PostsController {
    constructor(private  readonly  postsService: PostsService) {}


    @ApiOperation({summary: 'Массив постов'})
    @ApiResponse({status: 200, type: [PostsEntity]})
    @Get()
    async getAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number = 6,
        @Query('sort', new DefaultValuePipe('id')) sort: string,
        @Query('filter') filter: string,
        @Query('search', new DefaultValuePipe('')) search: string
    ): Promise<Pagination<PostsEntity>>{
        return this.postsService.getAll(sort, filter, search,{page, limit})
    }

    // Вернет список категорий
    @ApiOperation({summary: 'Массив тегов для фильтрации'})
    @ApiResponse({status: 200, type: PostsEntity})
    @Get('/tags')
    async getTags(){
        return this.postsService.tags()
    }

    // Отдать пост по id
    @ApiOperation({summary: 'Поиск поста по идентификатору'})
    @ApiResponse({status: 200, type: PostsEntity})
    @Get(':id')
    async getById(@Param('id') id: SearchIdPostDto){
        return this.postsService.getById(id)
    }

    // Создание поста, принимает файл и данные о посте
    @ApiOperation({summary: 'Создание поста'})
    @ApiResponse({status: 201, type: [PostsEntity]})
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'file', required: true, description: 'Изображение' })
    @ApiBody({ description: 'Данные для создания', type: [CreatePostsDto]})
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body('body') dto: string, @UploadedFile() file: Express.Multer.File){
        return this.postsService.create(JSON.parse(dto), file)
    }

    // Обновление количества просмотров
    @ApiOperation({summary: 'Обновление количества просмотров поста'})
    @ApiResponse({status: 200})
    @Patch(':id')
    async updateById(@Param('id') id: SearchIdPostDto){
        return this.postsService.updateById(id)
    }

    // Удаление поста, сейчас не используется
    @ApiOperation({summary: 'Удаление поста'})
    @ApiResponse({status: 200, type: PostsEntity})
    @Delete(':id')
    async deleteById(@Param('id') id: DeleteIdPostDto){
        return this.postsService.deleteById(id)
    }
}
