import {Body, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PostsEntity} from "./posts.entity";
import {Repository} from "typeorm";
import {PostsDto} from "./posts.dto";

@Injectable()
export class PostsService {
    constructor(@InjectRepository(PostsEntity) private readonly postRepository: Repository<PostsEntity>) {}

    async getAll(){
        return this.postRepository.find()
    }

    async getById(id: number){
        return this.postRepository.findOne({
            where: {
                id: Number(id)
            }
        })
    }

    async create(@Body() dto: PostsDto){
        const post = this.postRepository.create({title: dto.title})
        console.log(post)
        return {}
        // return this.postRepository.save(post)
    }
}
