import { Injectable } from '@nestjs/common';
import { UserStats } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReviewDto } from './dto';

@Injectable()
export class ReviewService {
  constructor(
    private prismaService: PrismaService
  ) { }

  getReviews(movieId: number): Promise<ReviewDto[]> {
    return this.prismaService.$queryRaw`
      SELECT
        review.user_id user_id,
        review.tmdb_id movie_id,
        review.rating,
        review.title,
        review.review,
        review.created_at,
        users.name user_name,
        users.avatar_path
      FROM review
      INNER JOIN users ON review.user_id = users.id AND review.tmdb_id = ${movieId}
      ORDER BY review.created_at DESC;
    `;
  }

  async postReview(userId: number, dto: ReviewDto): Promise<ReviewDto[]> {
    await this.prismaService.review.create({
      data: {
        user_id: userId,
        tmdb_id: dto.movie_id,
        rating: dto.rating,
        title: dto.title,
        review: dto.review
      }
    });

    this.createUserStats(userId)
      .then(() => this.updateUserStats(userId));

    return this.getReviews(dto.movie_id);
  }

  private createUserStats(userId: number): Promise<UserStats> {
    return this.prismaService.userStats.upsert({
      where: {
        user_id: userId
      },
      create: {
        user_id: userId
      },
      update: {}
    })
  }

  private updateUserStats(userId: number): Promise<UserStats> {
    return this.prismaService.userStats.update({
      where: {
        user_id: userId
      },
      data: {
        reviews_count: {
          increment: 1
        }
      }
    })
  }
}
