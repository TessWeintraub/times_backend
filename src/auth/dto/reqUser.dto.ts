import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber } from "class-validator";

export class ReqUserDto{

  @ApiProperty({example: 'Title', description: 'Название'})
  @IsNumber({},{message: 'Должно быть строкой'})
  readonly id: number

  @ApiProperty({example: 'Content', description: 'Контент'})
  @IsEmail({message: 'Должно быть строкой'})
  readonly email: string

  @ApiProperty({example: ["tag", "tag", "tag"], description: 'Теги'})
  @IsNumber({},{ message: 'В массиве должна быть строка'})
  readonly iar: number

  @ApiProperty({example: 1, description: 'Идентификатор пользователя'})
  @IsNumber({},{message: 'Должно быть число'})
  readonly exp: number
}