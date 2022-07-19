import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { UsersService } from '../../users/users.service';
import { UsersEntity } from "../../users/users.entity";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleAuthenticationService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService

  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(
      clientID,
      clientSecret
    );
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token
    })

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient
    });

    return userInfoResponse.data;
  }

  async handleRegisteredUser(user: UsersEntity, response) {
    if (!user.is_registered_with_google) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.authService.generateToken(user)
    const newRefreshToken = await this.authService.generateRefreshToken(user.email)

    response.cookie('access_token', accessToken)
    response.cookie('refresh_token', newRefreshToken, {httpOnly: true})
    const {password, refresh_token, is_registered_with_google, ...userSecure} = user
    return userSecure
  }

  async registerUser(token: string, response) {
    const userData = await this.getUserData(token);
    const refreshToken = await this.authService.generateRefreshToken(userData.email)
    console.log(userData);
    const newUser = {
      first_name: userData.given_name,
      last_name: userData.family_name,
      avatarUrl: userData.picture,
      email: userData.email,
      password: '',
      is_registered_with_google: true,
      refresh_token: refreshToken
    }

    const user = await this.usersService.create(newUser);

    response.cookie('access_token', await this.authService.generateToken(user))
    response.cookie('refresh_token', refreshToken, {httpOnly: true})
    const {password, refresh_token, is_registered_with_google, ...userSecure} = user
    return userSecure
  }

  async authenticate(token: string, response) {
    try {
      const tokenInfo = await this.oauthClient.getTokenInfo(token);
      const email = tokenInfo.email;
      const user = await this.usersService.getUserByEmail(email);

      if (!user) return await this.registerUser(token, response);

      const test = await this.handleRegisteredUser(user, response);

      return test
    } catch (error) {
      if (error.status === 401) {
        return await this.registerUser(token, response);
      }
    }
  }
}