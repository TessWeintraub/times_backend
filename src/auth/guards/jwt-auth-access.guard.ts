import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuardAccess implements CanActivate {
  constructor(private  jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()


      const authHeader = req.cookies.access_token

      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]

      if (bearer !== 'Bearer' || !token){
        throw new UnauthorizedException({message: 'Пользователь не авторизован'})
      }

      try {
        const decodedToken = this.jwtService.verify(token)

        if (decodedToken) new UnauthorizedException({message: 'Используется Refresh token'})
        req.user = decodedToken
        return true

      }catch (e) {
        if (e.message === 'jwt expired') throw new UnauthorizedException({ message: 'Access токен истек' })
        else throw new UnauthorizedException({message: e.message})
      }
  }
}