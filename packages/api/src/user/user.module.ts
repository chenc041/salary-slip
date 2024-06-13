import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '~/config/jwt-config/jwt-config.service';

@Module({
  imports: [HttpModule],
  controllers: [UserController],
  providers: [UserService, JwtService, JwtConfigService],
  exports: [UserService],
})
export class UserModule {}
