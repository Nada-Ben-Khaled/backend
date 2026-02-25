import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  // Création d'un utilisateur
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { roleId, password, ...rest } = createUserDto;

    const role = await this.rolesRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      ...rest,
      role,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Récupérer un utilisateur par id
  async getUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  // Modifier un utilisateur
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUser(id);

    if (updateUserDto.roleId) {
      const role = await this.rolesRepository.findOne({
        where: { id: updateUserDto.roleId },
      });
      if (!role) throw new NotFoundException('Role not found');
      user.role = role;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, { ...updateUserDto, role: user.role });
    return this.usersRepository.save(user);
  }

  // Supprimer un utilisateur
  async deleteUser(id: string): Promise<void> {
    const user = await this.getUser(id);
    await this.usersRepository.remove(user);
  }
}
