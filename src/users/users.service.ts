import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FilesService } from "../files/files.service";
import { UsersEntity } from "./users.entity";
import { CreateUsersDto } from "./dto/createUsers.dto";
import { DeleteIdUserDto } from "./dto/deleteUser.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UsersEntity) private userRepository: Repository<UsersEntity>,
              private fileService: FilesService,
              private  jwtService: JwtService
  ) {}


  async create(dto: CreateUsersDto){
      const user = await this.userRepository.create({
        ...dto,
        avatarUrl: '',
        date: Date.now(),
        refresh_token: ''
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

  async delete( userInfo: DeleteIdUserDto){
    const {raw, ...deletedUser} =  await this.userRepository.delete({ id: userInfo.id, email: userInfo.email })
    if(deletedUser.affected) {
      return {message: "Пользователь удален"}
    }
    throw new HttpException( 'Такого пользователя не существует', 404)
  }

  async getUserByEmail(email: string){
    return await this.userRepository.findOne({
      where: { email }
    })
  }

  async updatedRefreshToken(user: UsersEntity, newRefreshToken: string){
    await this.userRepository.update({id: user.id, email: user.email}, {
      refresh_token: newRefreshToken
    })
    const updatedUser = await this.userRepository.findOne({where: {id: user.id, email: user.email}})
    return updatedUser.refresh_token
  }
}
