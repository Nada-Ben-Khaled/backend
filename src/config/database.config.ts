import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/users.entity';
import { Role } from '../modules/roles/role.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'medi',
  database: 'mediflow',
  entities: [User, Role],
  synchronize: true,
};
