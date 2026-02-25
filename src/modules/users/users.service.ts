import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';
import { Role, RoleDocument } from '../roles/role.schema';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from '../auth/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  // Création d'un utilisateur
  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { roleId, password, ...rest } = createUserDto;

    const role = await this.roleModel.findById(roleId).exec();
    if (!role) throw new NotFoundException('Role not found');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      ...rest,
      role: role._id, // stocker l'ObjectId du rôle
      password: hashedPassword,
    });

    return user.save();
  }

  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().populate('role').exec();
  }

  // Récupérer un utilisateur par id
  async getUser(id: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const user = await this.userModel.findById(id).populate('role').exec();
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  // Modifier un utilisateur
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.getUser(id);

    if (updateUserDto.roleId) {
      const role = await this.roleModel.findById(updateUserDto.roleId).exec();
      if (!role) throw new NotFoundException('Role not found');
      user.role = role._id; // stocker ObjectId du rôle
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Mettre à jour les autres champs
    Object.assign(user, updateUserDto);

    return user.save();
  }

  // Supprimer un utilisateur
  async deleteUser(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`User with id ${id} not found`);
  }
}
