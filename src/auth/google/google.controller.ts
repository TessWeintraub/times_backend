import {
  Controller,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
  Res, HttpException, HttpStatus
} from "@nestjs/common";
import TokenVerificationDto from './dto/tokenVerification.dto';
import { GoogleAuthenticationService } from './google.service';
import { Response } from 'express';
import { CreateUsersDto } from "../../users/dto/createUsers.dto";
import tokenVerificationDto from "./dto/tokenVerification.dto";

@Controller('authentication')
export class GoogleController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService
  ) {
  }

  @Post()
  async create(@Body() tokenData: tokenVerificationDto, @Res({ passthrough: true }) res: Response) {

    return await this.googleAuthenticationService.authenticate(tokenData.token, res);
  }
}