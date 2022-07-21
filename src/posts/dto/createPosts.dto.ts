import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString, Length } from "class-validator";

export class CreatePostsDto{

    @ApiProperty({example: 'Title', description: 'Название'})
    @IsString({message: 'Должно быть строкой'})
    @Length(3, 100000,{message: "Длина строки меньше 3 либо больше n"})
    readonly title: string

    @ApiProperty({example: 'Content', description: 'Контент'})
    @IsString({message: 'Должно быть строкой'})
    @Length(3, 100000,{message: "Длина строки меньше 3 либо больше n"})
    readonly content: string

    @ApiProperty({example: ["tag", "tag", "tag"], description: 'Теги'})
    @IsArray({message: 'Должен быть массив'})
    @IsString({ each: true , message: 'В массиве должна быть строка'})
    readonly tags: string[]

    // @ApiProperty({example: 1, description: 'Идентификатор пользователя'})
    // @IsNumber({},{message: 'Должно быть число'})
    // readonly userId: number
}