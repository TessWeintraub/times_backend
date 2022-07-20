import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'Users'})
export class UsersEntity{

  @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn({type: 'integer'})
  id: number

  @ApiProperty({example: 'Ivan', description: 'Имя'})
  @Column({type: 'text'})
  first_name: string

  @ApiProperty({example: 'Ivanov', description: 'Фамилия'})
  @Column({type: 'text'})
  last_name: string

  @ApiProperty({example: 'url', description: 'Ссылка на изображение'})
  @Column({type: 'text', default: ''})
  avatarUrl: string

  @ApiProperty({example: 'email@mail.ru', description: 'Email пользователя'})
  @Column({type: 'text'})
  email: string

  @ApiProperty({example: 'password', description: 'Пароль пользователя'})
  @Column({type: 'text', nullable: true})
  password: string

  @ApiProperty({example: 1657529186632, description: 'Дата создания профиля'})
  @Column({type: 'bigint' })
  date: number

  @ApiProperty({example: 'token', description: 'Refresh токен'})
  @Column({type: 'text'})
  refresh_token: string

  @ApiProperty({example: 'Google registration', description: 'Флаг регистрации через google'})
  @Column({type: 'boolean', default: false})
  is_registered_with_google: boolean

  @ApiProperty({example: 'GitHub registration', description: 'Флаг регистрации через github'})
  @Column({type: 'boolean', default: false})
  is_registered_with_github: boolean
}