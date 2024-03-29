import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from 'express';
import * as bcrypt from "bcrypt"
import { CreateUsersDto } from "../users/dto/createUsers.dto";
import { UsersService } from "../users/users.service";
import { TokensService } from "./tokens/tokens.service";

@Injectable()
export class AuthService {

  constructor(
    private userService: UsersService,
    private  jwtService: JwtService,
    private tokenService: TokensService
  ) {}

  async login(userDto: CreateUsersDto, response){
    const user =  await this.validateUser(userDto)
    const refreshToken = await this.tokenService.generateRefreshToken(userDto.email)
    const accessToken = await this.tokenService.generateToken(user)
    await this.tokenService.updRefTokenUserInDB(user, refreshToken)

    response.cookie('access_token', accessToken, {domain: "justicetimes.com", path: "/", maxAge: 3900000} )
    response.cookie('refresh_token', refreshToken, {httpOnly: true, domain: "justicetimes.com", path: "/auth/refresh", maxAge: 3900000})
    response.cookie('is_auth', true, {domain: "justicetimes.com", path: "/", maxAge: 3900000})
    const {password, refresh_token, is_registered_with_google,  ...FilteredUser} = user
    return  FilteredUser
  }


  async  registration(userDto: CreateUsersDto, response){
    const candidate =  await this.userService.getUserByEmail(userDto.email)
    if (candidate) {
      throw  new HttpException('Пользователь уже зарегистрирован', HttpStatus.BAD_REQUEST)
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5)
    const refreshToken = await this.tokenService.generateRefreshToken(userDto.email)

    const user = await this.userService.create({...userDto, password: hashPassword, refresh_token: refreshToken})


    response.cookie(
        'access_token',
        await this.tokenService.generateToken(user),
        {domain: "justicetimes.com", path: "/", maxAge: 3900000}
    )
    response.cookie(
        'refresh_token',
        await this.tokenService.updRefTokenUserInDB(user, refreshToken),
        {httpOnly: true, domain: "justicetimes.com", path: "/auth/refresh", maxAge: 3900000}
    )
    response.cookie(
        'is_auth',
        true,
        {domain: "justicetimes.com", path: "/"}
    )

    const {password, refresh_token, is_registered_with_google,  ...FilteredUser} = user
    return  FilteredUser
  }

  private async validateUser(userDto: CreateUsersDto) {
    const user = await this.userService.getUserByEmail(userDto.email, true)
    if(!user) {
      throw  new UnauthorizedException({ message: 'Пользователя с таким email не существует' })
    }

    const passwordEquals = await  bcrypt.compare(userDto.password, user.password)

    if (!passwordEquals) throw  new UnauthorizedException({message: 'Не верный пароль'})

    if (user && passwordEquals){
      return user
    }
  }

  async refresh(userInfo: any, token: string, response ){

    const user = await this.userService.getUserByEmail(userInfo.email, true)

    if(!user || user.refresh_token !== token) {
      throw new HttpException('Пользователь не обнаружен', 404)
    }

    const accessToken = await this.tokenService.generateToken(userInfo)
    const refreshToken = await this.tokenService.generateRefreshToken(userInfo.email)

    await this.tokenService.updRefTokenUserInDB(userInfo, refreshToken)

    response.cookie('access_token', accessToken, {domain: "justicetimes.com", path: "/", maxAge: 3900000} )
    response.cookie('refresh_token', refreshToken, {httpOnly: true, domain: "justicetimes.com", path: "/auth/refresh", maxAge: 3900000})
    response.cookie('is_auth', true, {domain: "justicetimes.com", path: "/", maxAge: 3900000})

    return {message: 'Токены обновленны'}
  }

  async logout (cookies: object, response: Response) {
    response.cookie('access_token', null, {domain: "justicetimes.com", path: "/", maxAge: -1} )
    response.cookie('refresh_token', null, {httpOnly: true, domain: "justicetimes.com", path: "/auth/refresh", maxAge: -1})
    response.cookie('is_auth', null, {domain: "justicetimes.com", path: "/", maxAge: -1})
    return {}
  }
}
