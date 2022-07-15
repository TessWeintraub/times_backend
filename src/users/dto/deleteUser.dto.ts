import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber } from "class-validator";

export class DeleteIdUserDto{
  @ApiProperty({example: 1, description: 'Идентификатор пользователя'})
  @IsNumber()
  readonly id: number

  @ApiProperty({example: 'email@mail.ru', description: 'Email пользователя'})
  @IsEmail()
  readonly email: string
}