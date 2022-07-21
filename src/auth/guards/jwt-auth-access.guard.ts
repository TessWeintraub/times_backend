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

      const decodedToken = this.jwtService.verify(token)

    console.log(decodedToken);
      if (!decodedToken){
        throw new UnauthorizedException({message: 'Токен истек'})
      }
      if (decodedToken.refresh) {
        throw new UnauthorizedException({message: 'Используется Refresh token'})
      }
      req.user = decodedToken
      return true
  }
}