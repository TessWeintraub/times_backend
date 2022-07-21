import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { google, Auth } from "googleapis";
import { UsersService } from "../../users/users.service";
import { UsersEntity } from "../../users/users.entity";
import { AuthService } from "../auth.service";
import { TokensService } from "../tokens/tokens.service";

@Injectable()
export class GoogleAuthenticationService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly tokensService: TokensService
  ) {
    const clientID = this.configService.get("GOOGLE_AUTH_CLIENT_ID")
    const clientSecret = this.configService.get("GOOGLE_AUTH_CLIENT_SECRET")

    this.oauthClient = new google.auth.OAuth2(
      clientID,
      clientSecret
    )
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2("v2").userinfo

    this.oauthClient.setCredentials({
      access_token: token
    })

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient
    })

    return userInfoResponse.data
  }

  async handleRegisteredUser(user: UsersEntity, response: Response) {
    if (!user.is_registered_with_google) {
      throw new UnauthorizedException()
    }

    const accessToken = await this.tokensService.generateToken(user)
    const newRefreshToken = await this.tokensService.generateRefreshToken(user.email)

    response.cookie("access_token", accessToken)
    response.cookie("refresh_token", newRefreshToken, { httpOnly: true })
    const { password, refresh_token, is_registered_with_google, is_registered_with_github, ...userSecure } = user
    return userSecure
  }

  async registerUser(token: string, response: Response) {
    const userData = await this.getUserData(token)
    const refreshToken = await this.tokensService.generateRefreshToken(userData.email)
    const newUser = {
      first_name: userData.given_name,
      last_name: userData.family_name,
      avatar_url: userData.picture,
      email: userData.email,
      is_registered_with_google: true,
      refresh_token: refreshToken
    }

    const user = await this.usersService.create(newUser)

    response.cookie("access_token", await this.tokensService.generateToken(user))
    response.cookie("refresh_token", refreshToken, { httpOnly: true })
    const { password, refresh_token, is_registered_with_google, is_registered_with_github, ...userSecure } = user
    return userSecure
  }

  async authenticate(token: string, response: Response) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token)
    const email = tokenInfo.email
    const user = await this.usersService.getUserByEmail(email)

    if (!user) return await this.registerUser(token, response)

    return await this.handleRegisteredUser(user, response)
  }
}