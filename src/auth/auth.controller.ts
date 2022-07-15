import { Body, Controller, Get, Post, Req, UseGuards, Headers } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUsersDto } from "../users/dto/createUsers.dto";
import { AuthService } from "./auth.service";
import { ResTokensDto } from "./dto/resTokens.dto";
import { JwtAuthGuardRefresh } from "./jwt-auth-refresh.guard";

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

  @UseGuards(JwtAuthGuardRefresh)
  @Get()
  async refresh(@Req() req: Request, @Headers('authorization') token: string): Promise<ResTokensDto>{
    // @ts-ignore
    return await this.authService.refresh(req.user, token)
  }
}

