import { ForbiddenException, Injectable } from '@nestjs/common';
import { profile } from 'console';
import { Profile } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService
  ) { }

  async getUserById(id: number): Promise<Profile> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id
      }
    });

    if(!user) throw new ForbiddenException('User Not Found.');
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_path: user.avatar_path
    }
  }
}
