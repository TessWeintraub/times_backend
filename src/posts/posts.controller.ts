import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import {PostsDto} from "./posts.dto";
import {PostsService} from "./posts.service";

@Controller('posts')
export class PostsController {
    constructor(private  readonly  postsService: PostsService) {}

    @Get()
    async getAll(@Query('sort') sort: string, @Query('tag') tag: string){
        if (sort) return this.postsService.sort(sort)
        if (tag) return this.postsService.filterByTag(tag)
        return this.postsService.getAll()
    }

    // @Get('filter')
    // async filterByTag(@Query('tag') tag: string){
    //     return this.postsService.filterByTag(tag)
    // }
    //
    // @Get('sort')
    // async sort(@Query('sort') sort: string){
    //     return this.postsService.sort(sort)
    // }

    @Get(':id')
    async getById(@Param('id') id: string){
        return this.postsService.getById(Number(id))
    }

    @Post()
    async create(@Body() dto: PostsDto){
        return this.postsService.create(dto)
    }

    @Patch(':id')
    async updateById(@Body() viewsCount: number,@Param('id') id: string){
        return this.postsService.updateById(Number(id), viewsCount['viewsCount'])
    }

    @Delete(':id')
    async deleteById(@Param('id') id: string){
        return this.postsService.deleteById(Number(id))
    }
}
