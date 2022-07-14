import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesModule } from "../files/files.module";
import { UsersEntity } from "./users.entity";

@Module({
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([UsersEntity]), FilesModule],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
