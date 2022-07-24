import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UsersEntity } from "../users/users.entity";

@Entity({name: 'PostsEntity'})
export class PostsEntity{

    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    @PrimaryGeneratedColumn({type: 'integer', name: 'id'})
    id: number

    @ApiProperty({example: 'Title', description: 'Название'})
    @Column({type: 'text', name: 'title'})
    title: string

    @ApiProperty({example: 'Content', description: 'Контент'})
    @Column({type: 'text', name: 'content'})
    content: string

    @ApiProperty({example: 'url', description: 'Ссылка на изображение'})
    @Column({type: 'text', name: 'image_url'})
    image_url: string

    @ApiProperty({example: '[tag, tag, tag]', description: 'Теги'})
    @Column({type: 'text', array: true, name: 'tags'})
    tags: string[]

    @Column({type: 'integer', array: true, name: 'viewed_users', select: false, default: []})
    viewed_users: number[]

    @ApiProperty({example: 0, description: 'Количество просмотров'})
    @Column({type: 'integer', default: 0, name: 'views_count'})
    views_count: number

    @ApiProperty({example: 1657529186632, description: 'Дата создания'})
    @Column({type: 'bigint' , name: 'date'})
    date: number

    @ApiProperty({example: '45 min read', description: 'Время прочтения'})
    @Column({type: 'text', default: '45 min read', name: 'time_read'})
    time_read: string

    @ApiProperty({example: 1, description: 'Идентификатор пользователя создавшего пост'})
    @ManyToOne(() => UsersEntity, author => author.posts)
    @JoinColumn({name: 'author'})
    author: UsersEntity
}