import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors, Headers} from "@nestjs/common";
import {PostsDto} from "./posts.dto";
import {PostsService} from "./posts.service";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('posts')
export class PostsController {
    constructor(private  readonly  postsService: PostsService) {}

    @Get()
    async getAll(
        @Query('sort') sort: string,
        @Query('filter') filter: string,
        @Query('req') req: string,
        @Query('search') search: string
    ){
        if (sort && filter) return this.postsService.sortAndFilter(filter,sort)
        if (sort) return this.postsService.sort(sort)
        if (filter) return this.postsService.filterByTag(filter)
        if (req) return this.postsService.tags()
        if (search) return this.postsService.search(search)
        return this.postsService.getAll()
    }

    @Get(':id')
    async getById(@Param('id') id: string){
        return this.postsService.getById(Number(id))
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() dto: any, @UploadedFile() file: Express.Multer.File, @Headers() headers : any){
        console.log(headers)
        console.log(dto)
        // @ts-ignore
        return  {}
        // return this.postsService.create(JSON.parse(dto), file)
    }

    @Patch(':id')
    async updateById(@Param('id') id: string){
        return this.postsService.updateById(Number(id))
    }

    @Delete(':id')
    async deleteById(@Param('id') id: string){
        return this.postsService.deleteById(Number(id))
    }
}
