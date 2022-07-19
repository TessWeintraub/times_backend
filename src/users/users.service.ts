import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersEntity } from "./users.entity";
import { FilesService } from "../files/files.service";
import { CreateUsersDto } from "./dto/createUsers.dto";
import { DeleteIdUserDto } from "./dto/deleteUser.dto";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UsersEntity) private userRepository: Repository<UsersEntity>,
              private fileService: FilesService,
  ) {}


  async create(dto: CreateUsersDto){
      const user = await this.userRepository.create({
        ...dto,
        date: Date.now(),
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
    await this.userRepository.update({email: user.email}, {
      refresh_token: newRefreshToken
    })
    const updatedUser = await this.userRepository.findOne({where: {email: user.email}})
    return updatedUser.refresh_token
  }
}
