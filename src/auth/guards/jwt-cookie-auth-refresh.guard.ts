import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtCookieAuthGuardRefresh implements CanActivate {
  constructor(private  jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()

    const cookies = req.cookies.refresh_token

    if (!cookies) {
      throw new UnauthorizedException({ message: 'Токен не обнаружен' })
    }

    const bearer = cookies.split(' ')[0]
    const token = cookies.split(' ')[1]

    if (bearer !== 'Bearer' || !token){
      throw new UnauthorizedException({message: 'Не верный токен'})
    }

    const decodedToken = this.jwtService.verify(token)

    if (!decodedToken.refresh) {
      throw new UnauthorizedException({message: 'Используется Access token'})
    }
    req.user = decodedToken
    return true
  }
}