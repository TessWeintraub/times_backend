import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FilesService } from "../files/files.service";
import { UsersEntity } from "./users.entity";
import { CreateUsersDto } from "./dto/createUsers.dto";
import { DeleteIdUserDto } from "./dto/deleteUser.dto";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UsersEntity) private userRepository: Repository<UsersEntity>,
              private fileService: FilesService
  ) {}


  async create(dto: CreateUsersDto,){
      const user = await this.userRepository.create({
        ...dto,
        avatarUrl: 'fffff',
        date: Date.now()
      })
      await this.userRepository.save(user)
      return  user

  }

  async uploadPhoto(userId: number, file: Express.Multer.File){

    await this.userRepository.update({
      id: userId
    }, {
      avatarUrl: await this.fileService.uploadImage(file)
    })

    return await this.userRepository.findOne({
        where: {
          id: userId
        }
    })
  }

  async delete( userId: DeleteIdUserDto){
    await this.userRepository.delete({id: Number(userId)})
    return {message: "Пользователь удален"}
  }

  async getUserByEmail(email: string){
    return await this.userRepository.findOne({
      where: { email }
    })
  }
}
