import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUsersDto{

  @ApiProperty({example: 'Ivan', description: 'Имя'})
  @IsString({message: 'Должно быть строкой'})
  @Length(3, 100000,{message: "Длина строки меньше 3 либо больше n"})
  readonly first_name: string

  @ApiProperty({example: 'Ivanov', description: 'Фамилия'})
  @IsString({message: 'Должно быть строкой'})
  @Length(3, 100000,{message: "Длина строки меньше 3 либо больше n"})
  readonly last_name: string

  @ApiProperty({example: 'email@mail.ru', description: 'Email'})
  @IsEmail({message: 'Должен быть email'})
  readonly email: string

  @ApiProperty({example: 'Password', description: 'Пароль пользователя'})
  @IsString({message: 'Должна быть строка'})
  @Length(3, 100000,{message: "Длина строки меньше 3 либо больше n"})
  readonly password: string
}