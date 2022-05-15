import { Injectable } from '@nestjs/common';
import { TMDBService } from 'src/common/services';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActionType, UserAction } from './types/action.type';

function rawAction2Action(raw: any, type: ActionType): UserAction {
  return {
    type: type,
    createdAt: raw.created_at,
    authorId: raw.author_id,
    authorName: raw.author_name,
    authorAvatarPath: raw.author_avatar_path,
    movieId: raw.movie_id,
    rating: raw.rating,
    reviewTitle: raw.review_title,
    review: raw.review,
    listId: raw.list_id,
    listName: raw.list_name
  }
}

function isSameDate(a: Date, b: Date): boolean {
  const date1 = new Date(a);
  const date2 = new Date(b);
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate();
}

@Injectable()
export class FeedService {
  constructor(
    private prismaService: PrismaService,
    private tmdbService: TMDBService
  ) { }

  async getUserAction(userId: number): Promise<UserAction[]> {
    const lists = await this.getListActions(userId);

    const ratings = await this.getRatingActions(userId);

    const reviews = await this.getReviewActions(userId);

    const watched = await this.getWatchedActions(userId)
      .then(watched => watched.filter(watch =>
        ratings.findIndex(
          rating =>
            rating.movieId === watch.movieId
            && isSameDate(rating.createdAt, watch.createdAt)
        ) < 0
      ));

    const results = [];

    results.push(...lists);
    results.push(...await Promise.all(watched.map(watch => this.addMovieToAction(watch))));
    results.push(...await Promise.all(ratings.map(rating => this.addMovieToAction(rating))));
    results.push(...await Promise.all(reviews.map(review => this.addMovieToAction(review))));

    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return results.slice(0, 10);
  }

  private getWatchedActions(userId: number): Promise<UserAction[]> {
    return (this.prismaService.$queryRaw`
    SELECT
      users.id as author_id,
      users.name as author_name,
      users.avatar_path as author_avatar_path,
      user_watched.tmdb_id as movie_id,
      user_watched.created_at as created_at
    FROM user_watched
    INNER JOIN users ON user_watched.user_id = users.id
    WHERE users.id = ${userId};
    ` as Promise<any[]>
    ).then(watched => watched.map(watch => rawAction2Action(watch, "watch")));
  }

  private getReviewActions(userId: number): Promise<UserAction[]> {
    return (this.prismaService.$queryRaw`
    SELECT
      users.id as author_id,
      users.name as author_name,
      users.avatar_path as author_avatar_path,
      review.tmdb_id as movie_id,
      review.rating as rating,
      review.title as review_title,
      review.review as review,
      review.created_at as created_at
    FROM review
    INNER JOIN users ON review.user_id = users.id
    WHERE users.id = ${userId};
    ` as Promise<any[]>
    ).then(reviews => reviews.map(review => rawAction2Action(review, "review")));
  }

  private getRatingActions(userId: number): Promise<UserAction[]> {
    return (this.prismaService.$queryRaw`
      SELECT
        users.id as author_id,
        users.name as author_name,
        users.avatar_path as author_avatar_path,
        user_ratings.tmdb_id as movie_id,
        user_ratings.rating as rating,
        user_ratings.created_at as created_at
      FROM user_ratings
      INNER JOIN users ON user_ratings.user_id = users.id
      WHERE users.id = ${userId};
      ` as Promise<any[]>
    ).then(ratings => ratings.map(rating => rawAction2Action(rating, "rating")));
  }

  private getListActions(userId: number): Promise<UserAction[]> {
    return (this.prismaService.$queryRaw`
      SELECT
        users.id as author_id,
        users.name as author_name,
        users.avatar_path as author_avatar_path,
        movies_list.id as list_id,
        movies_list.list_name as list_name,
        movies_list.created_at as created_at
      FROM movies_list
      INNER JOIN users ON movies_list.user_id = users.id
      WHERE users.id = ${userId} AND movies_list.is_public = true;
      ` as Promise<any[]>
    ).then(ratings => ratings.map(rating => rawAction2Action(rating, "list")));
  }

  private async addMovieToAction(action: UserAction): Promise<UserAction> {
    const movie = await this.tmdbService.getMovie(action.movieId);
    return Object.assign(action, movie);
  }
}
