import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Genre } from "src/common/types";
import { PrismaService } from "src/prisma/prisma.service";
import { TMBDMovie } from "./types";

const url = 'https://api.themoviedb.org/3/movie/';

@Injectable()
export class TMDBService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService
  ) { }

  updateUserStats(userId: number, movieId: number) {
    this.httpService.get<TMBDMovie>(
      `${url}${movieId}?api_key=${process.env.TMDB_API_KEY}`
    ).subscribe(
      result => {
        const movie = result.data;

        movie.genres.forEach(genre => {
          this.createUserGenresStats(userId, genre).then(
            () => this.updateUserGenresStats(userId, genre)
          );
        });

        this.createUserMainStats(userId).then(
          () => this.updateUserMainStats(userId, movie.runtime)
        );
        
      }
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

  private async updateUserGenresStats(userId: number, genre: Genre) {
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

  private async updateUserMainStats(userId: number, runtime: number) {
    await this.prismaService.userStats.update({
      where: {
        user_id: userId
      },
      data: {
        movies_count: {
          increment: 1
        },
        hours_count: {
          increment: runtime
        }
      }
    });
  }

}