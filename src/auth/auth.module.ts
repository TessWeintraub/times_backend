import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { GoogleModule } from './google/google.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(()=> UsersModule),
    JwtModule.register({
      secret: `${process.env.SECRET_KEY_JWT}`,
      signOptions: {
        expiresIn: '1h'
      }
    }),
    GoogleModule
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
