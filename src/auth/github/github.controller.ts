import {
  Body,
  Controller,
  Post,
  Res
} from "@nestjs/common";
import { Response } from "express";
import { GithubAuthenticationService } from "./github.service";

@Controller('auth/github-authentication')
export class GithubController {
  constructor(private readonly githubAuthenticationService: GithubAuthenticationService){}

  @Post()
  async create(@Body('code') code: string, @Res({ passthrough: true }) response: Response) {
    return await this.githubAuthenticationService.authenticate(code, response);
  }
}
