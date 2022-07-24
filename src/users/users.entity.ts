import {Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Table} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PostsEntity } from "../posts/posts.entity";

@Entity({name: 'UsersEntity'})
export class UsersEntity{

  @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn({type: 'integer', name: 'id'})
  id: number

  @ApiProperty({example: 'Ivan', description: 'Имя'})
  @Column({type: 'text', name: 'first_name'})
  first_name: string

  @ApiProperty({example: 'Ivanov', description: 'Фамилия'})
  @Column({type: 'text', name: 'last_name'})
  last_name: string

  @ApiProperty({example: 'url', description: 'Ссылка на изображение'})
  @Column({type: 'text', default: '', name: 'avatar_name'})
  avatar_url: string

  @ApiProperty({example: 'email@mail.ru', description: 'Email пользователя'})
  @Column({type: 'text', name: 'email', select: false})
  email: string

  @ApiProperty({example: 'password', description: 'Пароль пользователя'})
  @Column({type: 'text', nullable: true, name: 'password', select: false})
  password: string

  @ApiProperty({example: 1657529186632, description: 'Дата создания профиля'})
  @Column({type: 'bigint', name: 'date' , select: false})
  date: number

  @ApiProperty({example: '[1, 2, 3, 4]', description: 'Массив идентификаторов постов'})
  // @Column({type: 'integer', array: true})
  @OneToMany(() => PostsEntity, post => post.author, {cascade: true})
  @JoinColumn({name: 'posts'})
  posts: PostsEntity[]

  @ApiProperty({example: 'token', description: 'Refresh токен'})
  @Column({type: 'text', select: false, name: 'refresh_token'})
  refresh_token: string

  @ApiProperty({example: 'Google registration', description: 'Флаг регистрации через google'})
  @Column({type: 'boolean', default: false, select: false, name: 'is_registered_with_google'})
  is_registered_with_google: boolean

  @ApiProperty({example: 'GitHub registration', description: 'Флаг регистрации через github'})
  @Column({type: 'boolean', default: false, select: false, name: 'is_registered_with_github'})
  is_registered_with_github: boolean

}