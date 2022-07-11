import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostsEntity} from "./posts.entity";
import { PostsService } from "./posts.service";
import { FilesModule } from "../files/files.module";

@Module({
  controllers: [PostsController],
  imports: [TypeOrmModule.forFeature([PostsEntity]), FilesModule],
  providers: [PostsService]
})
export class PostsModule {}
