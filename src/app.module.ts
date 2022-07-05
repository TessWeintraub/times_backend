import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import {PostsController} from "./posts/posts.controller";
import { join } from 'path'
import { PostsEntity } from "./posts/posts.entity";
// import { UsersModule } from './users/users/users.module';
// import { UsersModule } from './users/users.module';


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [PostsEntity],
            synchronize: true,
        }),
        PostsModule,
        // UsersModule
    ]
})
export class AppModule {

}