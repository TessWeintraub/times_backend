import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Headers,
  UploadedFile,
  UseInterceptors,
  UsePipes
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { ValidationPipeCreate } from "../pipes/validation.pipe";
import { UsersEntity } from "./users.entity";
import { CreateUsersDto } from "./dto/createUsers.dto";
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";
import { JwtService } from "@nestjs/jwt";

@Controller('users')
export class UsersController {
  constructor(private  readonly  usersService: UsersService,
              private  readonly  jwtService: JwtService) {
  }

  // Создание пользователя, принимает данные для создания
  @ApiOperation({summary: 'Создание пользователя'})
  @ApiResponse({status: 201, type: [UsersEntity]})
  @UsePipes(ValidationPipeCreate)
  @Post()
  async create(@Body() dto: CreateUsersDto){
    return this.usersService.create(dto)
  }

  // Обновление фотографии
  @ApiOperation({summary: 'Обновление аватара пользователя'})
  @ApiResponse({status: 201, type: [UsersEntity]})
  @ApiImplicitFile({ name: 'file', required: true, description: 'Изображение' })
  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  async updatePhoto(@UploadedFile() file: Express.Multer.File ){
    return this.usersService.uploadPhoto(2,file)
  }



  @ApiOperation({summary: 'Удаление профиля пользователя'})
  @ApiResponse({status: 201})
  @Delete()

  async delete(@Headers('authorization') token: string){
    const decoderToken = this.jwtService.verify(token)
    console.log(decoderToken);
    // return this.usersService.delete({id})
  }

}
