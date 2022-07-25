import {  Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TokensService } from "./tokens.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "../../users/users.entity";
import { TokensController } from "./tokens.controller";


@Module({
  controllers: [TokensController],
  providers: [TokensService],
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    JwtModule.register({
      secret: `${process.env.SECRET_KEY_JWT}`,
      signOptions: {
        expiresIn: '1m'
      }
    }),
  ],
  exports: [
    TokensService
  ]
})
export class TokensModule {}
