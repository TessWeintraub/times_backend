import { ApiProperty } from "@nestjs/swagger";

export class DeleteIdPostDto{
  @ApiProperty({example: 1, description: 'Идентификатор поста'})
  readonly id: string
}