import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../users/users.entity';
import { Role } from '../roles/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]), // <-- obligatoire pour injecter les repositories
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
