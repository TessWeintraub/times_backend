import { Injectable } from "@nestjs/common"
import { firstValueFrom } from "rxjs"
import { HttpService } from "@nestjs/axios"
import { Response } from "express"
import { TokensService } from "../tokens/tokens.service"
import { UsersService } from "../../users/users.service"
import { UsersEntity } from "../../users/users.entity"

@Injectable()
export class GithubAuthenticationService {
  baseUrl: string

  constructor(
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
    private readonly tokensService: TokensService
  ) {

    const clientId = process.env["GITHUB_AUTH_CLIENT_ID"]
    const clientSecret = process.env["GITHUB_AUTH_CLIENT_SECRET"]
    const url = process.env["GITHUB_AUTH_URL"]

    this.baseUrl = `${url}client_id=${clientId}&client_secret=${clientSecret}&code=`
  }

  async login(user: UsersEntity, response: Response) {
    const refreshToken = await this.tokensService.generateRefreshToken(user.email)
    const accessToken = await this.tokensService.generateToken(user)

    await this.tokensService.updRefTokenUserInDB(user, refreshToken)

    response.cookie("access_token", accessToken)
    response.cookie("refresh_token", refreshToken, { httpOnly: true })

    const {
      password,
      refresh_token,
      is_registered_with_google,
      is_registered_with_github,
      ...filteredUser
    } = user;

    return filteredUser
  }

  async registration(token: string, response: Response) {
    const userInfo = await this.getUserData(token)
    const refreshToken = await this.tokensService.generateRefreshToken(userInfo.email)

    const newUser = await this.usersService.create({ ...userInfo, refresh_token: refreshToken })

    const {
      password,
      refresh_token,
      is_registered_with_google,
      is_registered_with_github,
      ...filteredUser
    } = newUser

    const accessToken = await this.tokensService.generateToken(newUser)
    response.cookie("access_token", accessToken)
    response.cookie("refresh_token", refreshToken, { httpOnly: true })
    return filteredUser
  }

  async emailUserFromGitHub(token: string) {
    const allEmailsUser = await firstValueFrom(
      this.httpService.get(`https://api.github.com/user/emails`,
        {
          headers: {
            Authorization: `token ${token}`
          }
        })
    )
    return allEmailsUser.data.find(item => item.primary && item).email
  }

  async getUserData(token: string) {
    const userData = await firstValueFrom(
      this.httpService.get(`https://api.github.com/user`,
        {
          headers: {
            Authorization: `token ${token}`
          }
        })
    );

    return {
      email: userData.data.email || await this.emailUserFromGitHub(token),
      first_name: userData.data.name ? userData.data.name : userData.data.login,
      last_name: userData.data.name ? userData.data.name : userData.data.login,
      avatar_url: userData.data.avatar_url,
      is_registered_with_github: true,
    }
  }

  async authenticate(code: string, response: Response) {
    const accessTokenUserFromGitHub = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}${code}`,
        {},
        {
          headers: {
            Accept: "application/json"
          }
        })
    )

    const oAuthUserTokenFromGitHub = accessTokenUserFromGitHub.data.access_token // Токен для получения данных о пользователе
    const email = await this.emailUserFromGitHub(oAuthUserTokenFromGitHub) // Почта пользователя
    const user = await this.usersService.getUserByEmail(email) // Проверка пользователя на существование в бд

    if (!user) return await this.registration(oAuthUserTokenFromGitHub, response)

    return await this.login(user, response)
  }
}
