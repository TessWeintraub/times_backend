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

  async updatePostsUser(email: string, post: PostsEntity){
    const user = await this.getUserByEmail(email)
    console.log(user);
    await this.userRepository.update({id: user.id}, {
      posts:  [...user.posts, post]
    })
    return await this.userRepository.findOne({
      where: {
        id: user.id
      }
    })
  }

  async getUserByEmail(email: string){
    return await this.userRepository.findOne({
      where: { email },
      relations:{
        posts: true
      }
    })
  }

}
