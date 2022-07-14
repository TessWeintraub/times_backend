import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUsersDto } from "../users/dto/createUsers.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt"
import { UsersEntity } from "../users/users.entity";

@Injectable()
export class AuthService {

  constructor(private userService: UsersService,
              private  jwtService: JwtService) {}

  async login(userDto: CreateUsersDto){

  }

  async  registration(userDto: CreateUsersDto){
    const candidate =  await this.userService.getUserByEmail(userDto.email)
    if (candidate) {
      throw  new HttpException('Пользователь уже зарегистрирован', HttpStatus.BAD_REQUEST)
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5)

    const user = await this.userService.create({...userDto, password: hashPassword})

    return this.generateToken(user)
  }

  async generateToken(user: any) {
    const payload = {
      email: user.email,
      id: user.id,
    }
    return {
      token: this.jwtService.sign(payload)
    }
  }
}
