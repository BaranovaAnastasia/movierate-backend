import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/services';
import { TMDBService } from 'src/common/services';
import { Movie, MovieStats } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavouritesService {
  constructor(
    private CommonService: CommonService,
    private prismaService: PrismaService,
    private tmdbService: TMDBService
  ) { }

  async addMovieToFavourites(userId: number, movieId: string): Promise<MovieStats> {
    await this.prismaService.favourites.upsert({
      where: {
        userFavourite: {
          user_id: userId,
          tmdb_id: movieId
        }
      },
      create: {
        user_id: userId,
        tmdb_id: movieId
      },
      update: {}
    });

    return this.CommonService.getStats(movieId, userId);
  }

  async removeMovieFromFavourites(userId: number, movieId: string): Promise<MovieStats> {
    await this.prismaService.favourites.delete({
      where: {
        userFavourite: {
          user_id: userId,
          tmdb_id: movieId
        }
      }
    });

    return this.CommonService.getStats(movieId, userId);
  }

  async getFavourites(userId: number): Promise<Movie[]> {
    const moviesIds = await this.prismaService.favourites.findMany({
      where: {
        user_id: userId
      },
      select: {
        tmdb_id: true
      }
    }).then(results => results.map(item => item.tmdb_id));

    return Promise.all(
      moviesIds.map(id => this.tmdbService.getMovie(id))
    );
  }
}
