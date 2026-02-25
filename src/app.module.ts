import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from './modules/users/user.schema';
import { Role, RoleSchema } from './modules/roles/role.schema';

@Module({
  imports: [
     ConfigModule.forRoot({ isGlobal: true }),
    // Connexion à MongoDB
    MongooseModule.forRoot('mongodb://localhost:27017/mediflow'),

    // Déclaration des modèles pour Mongoose
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),

    // Modules applicatifs
    UsersModule,
    RolesModule,
    AuthModule,
  ],
})
export class AppModule {}
