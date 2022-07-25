import { Body, Controller, Get, Post, Req, UseGuards, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from 'express';
import { CreateUsersDto } from "../users/dto/createUsers.dto";
import { AuthService } from "./auth.service";
import { JwtCookieAuthGuardRefresh } from "./guards/jwt-cookie-auth-refresh.guard";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

  constructor(private  authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: CreateUsersDto, @Res({ passthrough: true }) response: Response, @Req() req: Request) {
    return this.authService.login(userDto, response)
  }

  @Post('/registration')
  registration(@Body() userDto: CreateUsersDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.registration(userDto, response)
  }

  @UseGuards(JwtCookieAuthGuardRefresh)
  @Get('/refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    //@ts-ignore
    return await this.authService.refresh(req.user, req.cookies.refresh_token, res)
  }
}

