import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/services';
import { TMDBService } from 'src/common/services';
import { Movie, MovieStats } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WatchedService {
  constructor(
    private prismaService: PrismaService,
    private tmdbService: TMDBService,
    private CommonService: CommonService
  ) {}

  async getWatched(userId: number): Promise<Movie[]> {
    const moviesIds = await this.prismaService.userWatched.findMany({
      where: {
        user_id: userId
      },
      select: {
        tmdb_id: true,
        created_at: true
      }
    }).then(
      results => {
        results.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
        return results.map(item => item.tmdb_id);
      }
    );

    return Promise.all(
      moviesIds.map(id => this.tmdbService.getMovie(id))
    );
  }

  async watchMovie(userId: number, movieId: string): Promise<MovieStats> {
    const isFirstWatched = await this.CommonService.markAsWatched(userId, movieId);
    isFirstWatched && this.tmdbService.updateUserStatsAdd(userId, movieId);

    return this.CommonService.getStats(movieId, userId);
  }

  async unwatchMovie(userId: number, movieId: string): Promise<MovieStats> {
    await this.removeUserRating(userId, movieId);
    await this.removeWatched(userId, movieId);
    this.tmdbService.updateUserStatsRemove(userId, movieId);
    return this.CommonService.getStats(movieId, userId);
  }

  private async removeUserRating(userId: number, movieId: string): Promise<void> {
    await this.prismaService.userRatings.deleteMany({
      where: {
        user_id: userId,
        tmdb_id: movieId
      }
    });
  }

  private async removeWatched(userId: number, movieId: string): Promise<void> {
    await this.prismaService.userWatched.deleteMany({
      where: {
        user_id: userId,
        tmdb_id: movieId
      }
    });
  }
}
