import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateIf } from "class-validator";

export class CreateUsersDto{

  @ApiProperty({example: 'Ivan', description: 'Имя'})
  @IsString({message: 'Должно быть строкой'})
  @MinLength(3, {message: "Длина строки меньше 3"})
  @IsNotEmpty()
  first_name: string

  @ApiProperty({example: 'Ivanov', description: 'Фамилия'})
  @IsString({message: 'Должно быть строкой'})
  @MinLength(3, {message: "Длина строки меньше 3"})
  last_name: string

  @ApiProperty({example: 'email@mail.ru', description: 'Email'})
  @IsEmail({message: 'Должен быть email'})
  email: string

  @ApiProperty({example: 'Password', description: 'Пароль пользователя'})
  @ValidateIf(user => (!user.is_registered_with_google || !user.is_registered_with_github)  && user.password)
  @IsString({message: 'Должна быть строка', })
  @MinLength(3, {message: "Длина строки меньше 3"})
  password?: string

  avatar_url?: string

  refresh_token: string

  is_registered_with_google?: boolean

  is_registered_with_github?: boolean
}