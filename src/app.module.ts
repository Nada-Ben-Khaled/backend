import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // AJOUTER CET IMPORT

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';

import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UsersModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
