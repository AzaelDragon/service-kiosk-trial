import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(id: number) {
    return this.prisma.user.findOne({
      where: {
        id: id,
      },
    });
  }
}
