import { ApiProperty } from "@nestjs/swagger";

export class CreatePostsDto{

    @ApiProperty({example: 'Title', description: 'Название'})
    readonly title: string
    @ApiProperty({example: 'Content', description: 'Контент'})
    readonly content: string
    @ApiProperty({example: '[tag, tag, tag]', description: 'Теги'})
    readonly tags: string[]
    @ApiProperty({example: '1', description: 'Идентификатор пользователя'})
    readonly userId: number
}