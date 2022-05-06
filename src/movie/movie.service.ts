import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MovieInteractionDto } from './dto';
import { TMDBService } from './tmdb.service';
import { MovieStats } from './types';

@Injectable()
export class MovieService {
  constructor(
    private prismaService: PrismaService,
    private tmdbService: TMDBService
  ) { }

  async rateMovie(userId: number, dto: MovieInteractionDto): Promise<MovieStats> {
    await this.upsertUserRating(userId, dto);

    const isFirstWatched = await this.markAsWatched(userId, dto.movieId);

    isFirstWatched && this.tmdbService.updateUserStats(userId, dto.movieId);

    return this.getStats(dto.movieId);
  }

  getRating(userId: number, movieId: number): Promise<number> {
    return this.prismaService.userRatings.findUnique({
      where: {
        userRating: {
          user_id: userId,
          tmdb_id: movieId
        }
      }
    }).then(result => result ? result.rating : null);
  }

  async isWatched(userId: number, movieId: number): Promise<boolean> {
    const watched = await this.prismaService.userWatched.findUnique({
      where: {
        userWatched: {
          user_id: userId,
          tmdb_id: movieId
        }
      }
    });

    return watched !== null;
  }

  async getStats(movieId: number): Promise<MovieStats> {
    const avg = await this.prismaService.userRatings.aggregate({
      _avg: {
        rating: true
      },
      _count: {
        user_id: true
      },
      where: {
        tmdb_id: movieId
      }
    });

    const watched = await this.prismaService.userWatched.count({
      where: {
        tmdb_id: movieId
      }
    });

    return {
      movieId: movieId,
      voteAvg: avg._avg.rating === null ? 0 : avg._avg.rating,
      voteCount: avg._count.user_id,
      watched: watched
    }
  }

  private async upsertUserRating(userId: number, dto: MovieInteractionDto): Promise<void> {
    await this.prismaService.userRatings.upsert({
      where: {
        userRating: {
          user_id: userId,
          tmdb_id: dto.movieId
        }
      },
      update: {
        rating: dto.rating
      },
      create: {
        user_id: userId,
        tmdb_id: dto.movieId,
        rating: dto.rating
      }
    });
  }

  private async markAsWatched(userId: number, movieId: number): Promise<boolean> {
    const record = await this.prismaService.userWatched.findUnique({
      where: {
        userWatched: {
          user_id: userId,
          tmdb_id: movieId
        }
      }
    });

    if (record) return false;

    await this.prismaService.userWatched.create({
      data: {
        user_id: userId,
        tmdb_id: movieId
      }
    });

    return true;
  }
}
