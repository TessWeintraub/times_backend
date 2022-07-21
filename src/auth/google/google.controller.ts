import {
  Controller,
  Post,
  Body,
  Res
} from "@nestjs/common";
import { Response } from 'express';
import { GoogleAuthenticationService } from './google.service';
import tokenVerificationDto from "./dto/tokenVerification.dto";

@Controller('google-authentication')
export class GoogleController {
  constructor(private readonly googleAuthenticationService: GoogleAuthenticationService) {}

  @Post()
  async create(@Body() tokenData: tokenVerificationDto, @Res({ passthrough: true }) response: Response) {
    return await this.googleAuthenticationService.authenticate(tokenData.token, response);
  }
}