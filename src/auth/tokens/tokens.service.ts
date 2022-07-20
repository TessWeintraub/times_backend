import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { UsersEntity } from "../../users/users.entity";

@Injectable()
export class TokensService {

  constructor(
    @InjectRepository(UsersEntity) private userRepositoryTT: Repository<UsersEntity>,
    private  jwtService: JwtService
  ) {}

  async generateToken(user: UsersEntity) {
    const payload = {
      email: user.email,
      id: user.id,
    }
    return `Bearer ${this.jwtService.sign(payload)}`
  }

  async generateRefreshToken (email: string) {
    return `Bearer ${this.jwtService.sign({email: email, refresh: true}, {expiresIn: '24h'})}`
  }

  async updRefTokenUserInDB(user: UsersEntity, newRefreshToken: string){
    await this.userRepositoryTT.update({email: user.email}, {
      refresh_token: newRefreshToken
    })
    const updatedUser = await this.userRepositoryTT.findOne({where: {email: user.email}})
    return updatedUser.refresh_token
  }
}
