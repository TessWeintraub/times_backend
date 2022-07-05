import {Body, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PostsEntity} from "./posts.entity";
import { Any, In, Repository } from "typeorm";
import {PostsDto} from "./posts.dto";

@Injectable()
export class PostsService {
    constructor(@InjectRepository(PostsEntity) private postRepository: Repository<PostsEntity>) {}

    async getAll(){
        return await this.postRepository.find({order: {id: 1}})
    }

    async getById(id: number){
        return await this.postRepository.findOne({
            where: {
                id: Number(id)
            }
        })
    }

    async filterByTag(tag: string){
        // return await this.postRepository.find({
        //     where: {
        //         tags : Any(tag)
        //     }
        // })
    }

    async sort(sort: string){
        return await this.postRepository.find({order:{ [sort] : 1}})
    }

    async create(@Body() dto: PostsDto){
        const post = await this.postRepository.create(dto)
        await this.postRepository.save(post)
        return await this.getAll()
    }

    async updateById(id: number, viewsCount: number){
        await this.postRepository.update({id: id},{viewsCount: viewsCount})
        return await this.getAll()
    }

    async deleteById(id: number){
        await this.postRepository.delete({id: id})
        return await this.getAll()
    }
}
