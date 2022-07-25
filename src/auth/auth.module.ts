import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { GoogleModule } from './google/google.module';
import { TokensModule } from './tokens/tokens.module';
import { GithubModule } from './github/github.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(()=> UsersModule),
    JwtModule.register({
      secret: `${process.env.SECRET_KEY_JWT}`,
      signOptions: {
        expiresIn: '1m'
      }
    }),
    GoogleModule,
    TokensModule,
    GithubModule
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
