import {
  Resolver,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Auth } from 'src/models/auth.model';
import { AuthService } from 'src/services/auth.service';
import { SignupInput } from 'src/models/inputs/signup.input';
import { UserRole, User } from '@prisma/client';
import { LoginInput } from 'src/models/inputs/login.input';
import { UseGuards } from '@nestjs/common';
import { ApiAuthGuard } from 'src/guards/api-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Resolver((of) => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => Auth)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.authService.createUser(
      data,
      UserRole.CLIENT,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(ApiAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Mutation((returns) => Auth)
  async technicianSignup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.authService.createUser(
      data,
      UserRole.TECHNICIAN,
    );
    return { accessToken, refreshToken };
  }

  @Mutation((returns) => Auth)
  async login(@Args('data') { email, password }: LoginInput) {
    const { accessToken, refreshToken } = await this.authService.login(
      email.toLowerCase(),
      password,
    );
    return { accessToken, refreshToken };
  }

  @ResolveField()
  async user(@Parent() auth: Auth) {
    return await this.authService.getUserFromToken(auth.accessToken);
  }
}
