import { Body, Controller, Get, Post, Req, UseGuards, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from 'express';
import { CreateUsersDto } from "../users/dto/createUsers.dto";
import { AuthService } from "./auth.service";
import { ResTokensDto } from "./dto/resTokens.dto";
import { JwtCookieAuthGuardRefresh } from "./guards/jwt-cookie-auth-refresh.guard";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

  constructor(private  authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: CreateUsersDto): Promise<ResTokensDto> {
    return this.authService.login(userDto)
  }

  @Post('/registration')
  registration(@Body() userDto: CreateUsersDto): Promise<ResTokensDto> {
    return this.authService.registration(userDto)
  }

  @UseGuards(JwtCookieAuthGuardRefresh)
  @Get('/refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {;
    //@ts-ignore
    return await this.authService.refresh(req.user, req.cookies.refresh_token, res)
  }
}

