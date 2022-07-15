import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesModule } from "../files/files.module";
import { UsersEntity } from "./users.entity";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "../auth/auth.module";

@Module({
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([UsersEntity]),
    FilesModule,
    JwtModule.register({
    secret: `${process.env.SECRET_KEY_JWT}`,
    signOptions: {
      expiresIn: '1h'
    }
  }),
    forwardRef(()=>AuthModule)
  ],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
