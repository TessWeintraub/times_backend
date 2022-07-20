import { forwardRef, Module } from "@nestjs/common";
import { GithubController } from './github.controller';
import { GithubAuthenticationService } from './github.service';
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "../../users/users.module";
import { TokensModule } from "../tokens/tokens.module";

@Module({
  controllers: [GithubController],
  imports: [
    HttpModule,
    ConfigModule,
    forwardRef(()=> TokensModule),
    forwardRef(()=> UsersModule),
  ],
  providers: [GithubAuthenticationService]
})
export class GithubModule {}
