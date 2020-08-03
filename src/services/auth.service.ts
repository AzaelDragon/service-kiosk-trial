import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import { PasswordService } from 'src/services/password.service';
import { SignupInput } from 'src/models/inputs/signup.input';
import { PrismaService } from 'src/services/prisma.service';
import { Token } from 'src/models/token.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(payload: SignupInput, role: UserRole): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password,
    );

    try {
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
          role: role,
        },
      });

      return this.generateToken({
        userId: user.id,
      });
    } catch (error) {
      throw new ConflictException(`Email ${payload.email} is already in use.`);
    }
  }

  async login(email: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateToken({
      userId: user.id,
    });
  }

  validateUser(userId: number): Promise<User> {
    return this.prisma.user.findOne({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findOne({ where: { id } });
  }

  generateToken(payload: Record<string, unknown>): Token {
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_IN'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token);

      return this.generateToken({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
