import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import * as md5 from 'md5';
import { JwtService } from '@nestjs/jwt';
import { Profile, Tokens } from 'src/common/types';
import { UserStats } from '@prisma/client';

const defaultAvatarPath = 'https://www.gravatar.com/avatar/';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) { }

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.getHash(dto.password);

    const duplicate = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (duplicate) throw new ForbiddenException("Email already exists.")

    const newUser = await this.prismaService.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        avatar_path: `${defaultAvatarPath}${md5(dto.email)}?f=y&d=identicon`,
        hash
      }
    });

    const tokens = await this.getTokens(newUser.id, dto);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    await this.createNewUserStats(newUser.id);

    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (!user) throw new ForbiddenException("User Not Found.");

    const passwordMatches = await argon.verify(user.hash, dto.password);

    if (!passwordMatches) throw new ForbiddenException("Access Denied.");

    const tokens = await this.getTokens(user.id, dto);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null
        }
      },
      data: {
        hashedRt: null
      }
    });
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) throw new ForbiddenException("User Not Found.");

    const rtMatches = await argon.verify(user.hashedRt, rt);

    if (!rtMatches) throw new ForbiddenException("Access Denied.");

    const tokens = await this.getTokens(
      user.id,
      {
        name: user.name,
        email: user.email,
        password: user.hash,
        avatar_path: user.avatar_path
      }
    );
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async getUser(userId: number): Promise<Profile> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId
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

  private async updateRtHash(userId: number, rt: string) {
    const hash = await this.getHash(rt);
    await this.prismaService.user.update({
      where: {
        id: userId
      },
      data: {
        hashedRt: hash
      }
    })
  }

  private getHash(data: string): Promise<string> {
    return argon.hash(data);
  }

  private async getTokens(userId: number, dto: AuthDto): Promise<Tokens> {
    const { password, ...payload } = dto;

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          ...payload
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15
        }
      ),

      this.jwtService.signAsync(
        {
          sub: userId,
          ...payload
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7
        }
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt
    }
  }

  private createNewUserStats(userId: number): Promise<UserStats> {
    return this.prismaService.userStats.create({
      data: {
        user_id: userId
      }
    });
  }
}
