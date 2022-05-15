import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserGenresStats, UserStats } from '@prisma/client';
import { Profile } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserTopEntry } from './dto';
import { UserTopOption } from './types/user-top-option.type';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService
  ) { }

  async getUserById(id: number, currentUserId?: number): Promise<Profile> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id
      }
    });

    if (!user) throw new ForbiddenException('User Not Found.');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_path: user.avatar_path,
      isFollowed: await this.isFollowed(currentUserId, id),
      isCurrentUser: id === currentUserId
    }
  }

  getUserStats(id: number): Promise<UserStats> {
    return this.prismaService.userStats.findUnique({
      where: {
        user_id: id
      }
    });
  }

  getUserGenresStats(id: number): Promise<UserGenresStats[]> {
    return this.prismaService.userGenresStats.findMany({
      where: {
        user_id: id
      }
    });
  }

  getUserTop(by: UserTopOption, limit: number): Promise<UserTopEntry[]> {
    switch (by) {
      case 'movies':
        return this.getUserTopByMovies(limit);
      case 'minutes':
        return this.getUserTopByMinutes(limit);
      case 'reviews':
        return this.getUserTopByReviews(limit);
    }
  }

  async follow(followerId: number, followingId: number): Promise<void> {
    await this.prismaService.follows.upsert({
      where: {
        follow: {
          follower_id: followerId,
          following_id: followingId
        }
      },
      create: {
        follower_id: followerId,
        following_id: followingId
      },
      update: {}
    });
  }

  async unfollow(followerId: number, followingId: number): Promise<void> {
    await this.prismaService.follows.delete({
      where: {
        follow: {
          follower_id: followerId,
          following_id: followingId
        }
      }
    });
  }

  async isFollowed(followerId: number, followingId: number): Promise<boolean> {
    if(!followerId) return undefined;

    const record = await this.prismaService.follows.findUnique({
      where: {
        follow: {
          follower_id: followerId,
          following_id: followingId
        }
      }
    });

    return record !== null;
  }

  async getAllFollowing(userId: number): Promise<Profile[]> {
    const records = await this.prismaService.follows.findMany({
      where: {
        follower_id: userId
      },
      select: {
        following_id: true
      }
    });

    return Promise.all(
      records.map(record => this.getUserById(record.following_id))
    )
  }

  async getAllFollowedBy(userId: number): Promise<Profile[]> {
    const records = await this.prismaService.follows.findMany({
      where: {
        following_id: userId
      },
      select: {
        follower_id: true
      }
    });

    return Promise.all(
      records.map(record => this.getUserById(record.follower_id))
    )
  }

  private getUserTopByMovies(limit: number): Promise<UserTopEntry[]> {
    return this.prismaService.$queryRaw`
      SELECT
        users.id,
        users.name,
        users.avatar_path,
        user_stats.movies_count,
        user_stats.minutes_count,
        user_stats.reviews_count
      FROM user_stats
      INNER JOIN users ON user_stats.user_id = users.id
      ORDER BY user_stats.movies_count DESC
      LIMIT ${Number(limit)};
    `;
  }
  private getUserTopByMinutes(limit: number): Promise<UserTopEntry[]> {
    return this.prismaService.$queryRaw`
      SELECT
        users.id,
        users.name,
        users.avatar_path,
        user_stats.movies_count,
        user_stats.minutes_count,
        user_stats.reviews_count
      FROM user_stats
      INNER JOIN users ON user_stats.user_id = users.id
      ORDER BY user_stats.minutes_count DESC
      LIMIT ${Number(limit)};
    `;
  }
  private getUserTopByReviews(limit: number): Promise<UserTopEntry[]> {
    return this.prismaService.$queryRaw`
      SELECT
        users.id,
        users.name,
        users.avatar_path,
        user_stats.movies_count,
        user_stats.minutes_count,
        user_stats.reviews_count
      FROM user_stats
      INNER JOIN users ON user_stats.user_id = users.id
      ORDER BY user_stats.reviews_count DESC
      LIMIT ${Number(limit)};
    `;
  }
}
