import { forwardRef, Module } from "@nestjs/common";
import { PostsController } from './posts.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostsEntity} from "./posts.entity";
import { PostsService } from "./posts.service";
import { FilesModule } from "../files/files.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";

@Module({
  controllers: [PostsController],
  imports: [
    TypeOrmModule.forFeature([PostsEntity]),
    JwtModule.register({
      secret: `${process.env.SECRET_KEY_JWT}`,
      signOptions: {
        expiresIn: '1h'
      }
    }),
    forwardRef(()=>UsersModule),
    FilesModule
  ],
  providers: [PostsService]
})
export class PostsModule {}
