import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import {PostsController} from "./posts/posts.controller";
import { join } from 'path'


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
            entities: [join(__dirname, '**','*.entity.{ts.js}')],
            synchronize: true,
        }),
        PostsModule
    ]
})
export class AppModule {

}