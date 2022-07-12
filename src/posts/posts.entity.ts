import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'Posts'})
export class PostsEntity{

    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    @PrimaryGeneratedColumn({type: 'integer'})
    id: number

    @ApiProperty({example: 'Title', description: 'Название'})
    @Column({type: 'text'})
    title: string

    @ApiProperty({example: 'Content', description: 'Контент'})
    @Column({type: 'text'})
    content: string

    @ApiProperty({example: 'url', description: 'Ссылка на изображение'})
    @Column({type: 'text'})
    imageUrl: string

    @ApiProperty({example: '[tag, tag, tag]', description: 'Теги'})
    @Column({type: 'text', array: true})
    tags: string[]

    @ApiProperty({example: 0, description: 'Количество просмотров'})
    @Column({type: 'integer', default: 0})
    views_count: number


    @ApiProperty({example: 1657529186632, description: 'Дата создания'})
    @Column({type: 'bigint' })
    date: number

    @ApiProperty({example: '45 min read', description: 'Время прочтения'})
    @Column({type: 'text', default: '45 min read'})
    timeRead: string

    @ApiProperty({example: 1, description: 'Идентификатор пользователя создавшего пост'})
    @Column({type: 'integer'})
    userId: number
}