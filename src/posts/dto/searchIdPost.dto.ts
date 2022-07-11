import { ApiProperty } from "@nestjs/swagger";

export class SearchIdPostDto{
  @ApiProperty({example: 1, description: 'Идентификатор поста'})
  readonly id: string
}