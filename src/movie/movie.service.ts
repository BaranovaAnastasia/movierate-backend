import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MovieInteractionDto } from './dto';
import { TMDBService } from '../common/services';
import { Movie, MovieStats } from 'src/common/types';
import { CommonService } from 'src/common/services';

type MovieRating = { tmdb_id: string, vote_average: number };

@Injectable()
export class MovieService {
  constructor(
    private CommonService: CommonService,
    private prismaService: PrismaService,
    private tmdbService: TMDBService
  ) { }

  async rateMovie(userId: number, dto: MovieInteractionDto): Promise<MovieStats> {
    await this.upsertUserRating(userId, dto);

    const isFirstWatched = await this.CommonService.markAsWatched(userId, dto.movieId);

    isFirstWatched && this.tmdbService.updateUserStatsAdd(userId, dto.movieId);

    return this.CommonService.getStats(dto.movieId, userId);
  }

  async getTopRatedMovies(): Promise<Movie[]> {

    const avg: MovieRating[] = await this.prismaService.$queryRaw`
      SELECT
        tmdb_id,
        AVG(rating) AS vote_average
      FROM user_ratings
      GROUP BY tmdb_id
      ORDER BY vote_average DESC;
    `;

    return Promise.all(
      avg.map(mr =>
        this.tmdbService.getMovie(mr.tmdb_id)
          .then(movie => Object.assign(movie, {
            vote_average: mr.vote_average
          }))
      )
    );
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


}
