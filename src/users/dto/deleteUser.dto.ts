import { ApiProperty } from "@nestjs/swagger";

export class DeleteIdUserDto{
  @ApiProperty({example: 1, description: 'Идентификатор пользователя'})
  readonly id: number
}