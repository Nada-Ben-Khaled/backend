import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { User } from '../users/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Créer un utilisateur
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  // Récupérer tous les utilisateurs
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  // Récupérer un utilisateur par id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.getUser(id);
  }

  // Modifier un utilisateur
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // Supprimer un utilisateur
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
