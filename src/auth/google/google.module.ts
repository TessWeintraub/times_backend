import { forwardRef, Module } from "@nestjs/common";
import { GoogleController } from './google.controller';
import { UsersModule } from "../../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { GoogleAuthenticationService } from "./google.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth.module";
import { TokensService } from "../tokens/tokens.service";
import { TokensModule } from "../tokens/tokens.module";

@Module({
  controllers: [GoogleController],
  providers: [GoogleAuthenticationService],
  imports: [
    forwardRef(()=> AuthModule),
    forwardRef(()=> UsersModule),
    JwtModule.register({
      secret: `${process.env.SECRET_KEY_JWT}`,
      signOptions: {
        expiresIn: '1h'
      }
    }),
    ConfigModule,
    TokensModule,
    GoogleModule
  ],
})
export class GoogleModule {}
