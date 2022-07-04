import { Body, Controller, Get, Post } from "@nestjs/common";
import {PostsDto} from "./posts.dto";
import {PostsService} from "./posts.service";

@Controller('posts')
export class PostsController {
    constructor(private  readonly  postsService: PostsService) {
    }

    @Get()
    async getAll(){
        return this.postsService.getAll()
    }
    @Post()
    async create(@Body() dto: PostsDto){
        return this.postsService.create(dto)
    }
}
