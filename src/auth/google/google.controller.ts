import {
  Controller,
  Post,
  Body,
  Res
} from "@nestjs/common";
import { Response } from 'express';
import { GoogleAuthenticationService } from './google.service';
import tokenVerificationDto from "./dto/tokenVerification.dto";


@Controller('auth/google-authentication')
export class GoogleController {
  constructor(private readonly googleAuthenticationService: GoogleAuthenticationService) {}

  @Post()
  async create(@Body() tokenData: tokenVerificationDto, @Res({ passthrough: true }) response: Response) {
    const test = await this.googleAuthenticationService.authenticate(tokenData.token, response);
    console.log(test);
    return test
  }
}