import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { MovieStats } from "../types";

@Injectable()
export class CommonService {
  constructor(private prismaService: PrismaService) { }

  async getStats(movieId: string, currentUserId: number): Promise<MovieStats> {
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
      watched: watched,

      currentRating: await this.getRating(currentUserId, movieId),
      isWatched: await this.isWatched(currentUserId, movieId),
      isFavourite: await this.isFavourite(currentUserId, movieId)
    }
  }

  getRating(userId: number, movieId: string): Promise<number> {
    if (!userId) return undefined;

    return this.prismaService.userRatings.findUnique({
      where: {
        userRating: {
          user_id: userId,
          tmdb_id: movieId
        }
      }
    }).then(result => result ? result.rating : undefined);
  }

  async markAsWatched(userId: number, movieId: string): Promise<boolean> {
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

  private async isWatched(userId: number, movieId: string): Promise<boolean> {
    if (!userId) return undefined;

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

  private async isFavourite(userId: number, movieId: string): Promise<boolean> {
    if (!userId) return undefined;

    const record = await this.prismaService.favourites.findUnique({
      where: {
        userFavourite: {
          user_id: userId,
          tmdb_id: movieId
        }
      }
    });

    return record !== null;
  }
}