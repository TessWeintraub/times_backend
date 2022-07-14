import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import { PostsModule } from './posts/posts.module';
import { PostsEntity } from "./posts/posts.entity";
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { UsersEntity } from "./users/users.entity";
import { AuthModule } from './auth/auth.module';



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
            entities: [UsersEntity,PostsEntity],
            synchronize: true,
        }),
        PostsModule,
        FilesModule,
        UsersModule,
        AuthModule
    ]
})
export class AppModule {

}