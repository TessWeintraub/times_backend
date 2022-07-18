import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt"
import { CreateUsersDto } from "../users/dto/createUsers.dto";
import { UsersService } from "../users/users.service";
import { UsersEntity } from "../users/users.entity";

@Injectable()
export class AuthService {

  constructor(private userService: UsersService,
              private  jwtService: JwtService) {}

  async login(userDto: CreateUsersDto){
    const user =  await this.validateUser(userDto)
    const refreshToken = `Bearer ${this.jwtService.sign({email: userDto.email, refresh: true}, {expiresIn: '24h'})}`
    return {
      access_token: await this.generateToken(user),
      refresh_token: await this.userService.updatedRefreshToken(user, refreshToken)
    }
  }

  async  registration(userDto: CreateUsersDto){
    const candidate =  await this.userService.getUserByEmail(userDto.email)
    if (candidate) {
      throw  new HttpException('Пользователь уже зарегистрирован', HttpStatus.BAD_REQUEST)
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5)
    const refreshToken = `Bearer ${this.jwtService.sign({email: userDto.email, refresh: true}, {expiresIn: '24h'})}`

    const user = await this.userService.create({...userDto, password: hashPassword, refresh_token: refreshToken})

    return {
      access_token: await this.generateToken(user),
      refresh_token: refreshToken
    }
  }

  async generateToken(user: UsersEntity) {
    const payload = {
      email: user.email,
      id: user.id,
    }
    return `Bearer ${this.jwtService.sign(payload)}`
  }

  private async validateUser(userDto: CreateUsersDto) {
    const user = await this.userService.getUserByEmail(userDto.email)

    if(!user) throw  new UnauthorizedException({message: 'Пользователя с таким email не существует'})

    const passwordEquals = await  bcrypt.compare(userDto.password, user.password)
    if (!passwordEquals) throw  new UnauthorizedException({message: 'Не верный пароль'})

    if (user && passwordEquals){
      return user
    }
  }

  async refresh(userInfo: any, token: string, response ){

    const user = await this.userService.getUserByEmail(userInfo.email)

    if(!user || user.refresh_token !== token) {
      throw new HttpException('Пользователь не обнаружен', 404)
    }

    const refreshToken = `Bearer ${this.jwtService.sign({email: user.email, refresh: true}, {expiresIn: '24h'})}`
    const accessToken = await this.generateToken(userInfo)

    await this.userService.updatedRefreshToken(userInfo, refreshToken)

    response.cookie('access_token', accessToken)
    response.cookie('refresh_token', refreshToken, {httpOnly: true})

    return {message: 'Токены обновленны'}
  }
}
