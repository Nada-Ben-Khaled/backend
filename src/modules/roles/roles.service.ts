import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from '../auth/dto/create-role.dto';
import { UpdateRoleDto } from '../auth/dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  // Créer un rôle
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  // Lister tous les rôles
  async getAllRoles(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  // Récupérer un rôle par id
  async getRole(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with id ${id} not found`);
    return role;
  }

  // Modifier un rôle
  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.getRole(id);
    Object.assign(role, updateRoleDto);
    return this.rolesRepository.save(role);
  }

  // Supprimer un rôle
  async deleteRole(id: string): Promise<void> {
    const role = await this.getRole(id);
    await this.rolesRepository.remove(role);
  }
}