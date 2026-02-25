import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';
import { Role } from '../roles/role.entity';
import { SignUpDto } from '../auth/dto/SignUp.dto ';
import { SignInDto } from '../auth/dto/SignIn.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  // 1. Demande de mot de passe oublié
  async forgotPassword(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Email non trouvé');

    // Générer un token aléatoire
    const token = randomBytes(32).toString('hex');
    user.resetToken = token;
    await this.usersRepository.save(user);

    // Ici tu enverrais un email à l'utilisateur avec le lien de réinitialisation
    // Exemple : http://localhost:3000/auth/reset-password?token=<token>
    console.log(
      `Lien de réinitialisation : http://localhost:3000/auth/reset-password?token=${token}`,
    );

    return { message: 'Lien de réinitialisation envoyé à votre email' };
  }

  // 2. Réinitialiser le mot de passe
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersRepository.findOne({
      where: { resetToken: token },
    });
    if (!user) throw new BadRequestException('Token invalide');

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null; // supprimer le token après usage
    await this.usersRepository.save(user);

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  // Sign Up
  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { email, password, roleId, ...rest } = signUpDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) throw new BadRequestException('Email already exists');

    const role = await this.rolesRepository.findOne({ where: { id: roleId } });
    if (!role) throw new BadRequestException('Role not found');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      ...rest,
      email,
      password: hashedPassword,
      role,
    });
    return this.usersRepository.save(user);
  }

  // Sign In
  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { email, password } = signInDto;
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role.name };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
