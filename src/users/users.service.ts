import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersEntity } from "./users.entity";
import { FilesService } from "../files/files.service";
import { CreateUsersDto } from "./dto/createUsers.dto";
import { DeleteIdUserDto } from "./dto/deleteUser.dto";
import { PostsEntity } from "../posts/posts.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private userRepository: Repository<UsersEntity>,
    private fileService: FilesService,
  ) {}


  async create(dto: CreateUsersDto){
      const user = await this.userRepository.create({
        ...dto,
        posts: [],
        date: Date.now(),
      })

      await this.userRepository.save(user)
      return  user
  }

  async uploadPhoto(userId: number, file: Express.Multer.File){

    await this.userRepository.update({
      id: userId
    }, {
      avatar_url: await this.fileService.uploadImage(file)
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


  async getUserById(id: number){
    return await this.userRepository.findOneBy({id})
  }

  async getUserByEmail(email: string, isRelation?: boolean){
    if (isRelation) {
      return await this.userRepository.findOne({
          where: { email: email },
          relations: {
            posts: true
          },
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            password: true,
            date: true,
            avatar_url: true,
            refresh_token: true,
            posts: {
              id: true,
              image_url: true,
              title: true,
              content: true,
              time_read: true
            }

          }
        }
        )
    }
   return await this.userRepository.findOneBy({email})
  }
}
