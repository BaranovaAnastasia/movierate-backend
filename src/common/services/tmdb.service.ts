import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom, map, Observable } from "rxjs";
import { Genre, Movie, TMBDMovie } from "src/common/types";
import { PrismaService } from "src/prisma/prisma.service";

const url = 'https://api.themoviedb.org/3/movie/';
const posterUrl = 'https://image.tmdb.org/t/p/w1280';

@Injectable()
export class TMDBService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService
  ) { }

  updateUserStatsAdd(userId: number, movieId: string) {
    this.httpService.get<TMBDMovie>(
      `${url}${movieId}?api_key=${process.env.TMDB_API_KEY}`
    ).subscribe(
      result => {
        const movie = result.data;

        movie.genres.forEach(genre => {
          this.createUserGenresStats(userId, genre).then(
            () => this.updateUserGenresStatsAdd(userId, genre)
          );
        });

        this.createUserMainStats(userId).then(
          () => this.updateUserMainStatsAdd(userId, movie.runtime)
        );

      }
    );
  }

  updateUserStatsRemove(userId: number, movieId: string) {
    this.httpService.get<TMBDMovie>(
      `${url}${movieId}?api_key=${process.env.TMDB_API_KEY}`
    ).subscribe(
      result => {
        const movie = result.data;

        movie.genres.forEach(genre => this.updateUserGenresStatsRemove(userId, genre));

        this.updateUserMainStatsRemove(userId, movie.runtime)

      }
    );
  }

  getMovie(movieId: string): Promise<Movie> {
    return firstValueFrom(
      this.httpService.get<TMBDMovie>(
        `${url}${movieId}?api_key=${process.env.TMDB_API_KEY}`
      ).pipe(
        map(result => result.data),
        map(result => {
          return {
            id: movieId,
            title: result.title,
            release_date: result.release_date,
            poster_path: result.poster_path ? `${posterUrl}${result.poster_path}` : undefined
          }
        })
      )
    );
  }

  private async createUserGenresStats(userId: number, genre: Genre) {
    await this.prismaService.userGenresStats.upsert({
      where: {
        userGenre: {
          user_id: userId,
          genre_id: genre.id
        }
      },
      create: {
        user_id: userId,
        genre_id: genre.id,
        genre_name: genre.name
      },
      update: {}
    });
  }

  private async updateUserGenresStatsAdd(userId: number, genre: Genre) {
    await this.prismaService.userGenresStats.update({
      where: {
        userGenre: {
          user_id: userId,
          genre_id: genre.id
        }
      },
      data: {
        movies_count: {
          increment: 1
        }
      }
    });
  }

  private async updateUserGenresStatsRemove(userId: number, genre: Genre) {
    await this.prismaService.userGenresStats.update({
      where: {
        userGenre: {
          user_id: userId,
          genre_id: genre.id
        }
      },
      data: {
        movies_count: {
          decrement: 1
        }
      }
    });
  }

  private async createUserMainStats(userId: number) {
    await this.prismaService.userStats.upsert({
      where: {
        user_id: userId
      },
      create: {
        user_id: userId
      },
      update: {}
    });
  }

  private async updateUserMainStatsAdd(userId: number, runtime: number) {
    await this.prismaService.userStats.update({
      where: {
        user_id: userId
      },
      data: {
        movies_count: {
          increment: 1
        },
        minutes_count: {
          increment: runtime
        }
      }
    });
  }

  private async updateUserMainStatsRemove(userId: number, runtime: number) {
    await this.prismaService.userStats.update({
      where: {
        user_id: userId
      },
      data: {
        movies_count: {
          decrement: 1
        },
        minutes_count: {
          decrement: runtime
        }
      }
    });
  }

}