import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../services/auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { ApiAuthGuard } from '../../guards/api-auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { PasswordService } from '../../services/password.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    ApiAuthGuard,
    RoleGuard,
    PasswordService,
    PrismaService,
  ],
  exports: [ApiAuthGuard],
})
export class AuthModule {}
