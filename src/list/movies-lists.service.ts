import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TMDBService } from 'src/common/services';
import { Movie } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavouriteDto, ListMovieDto, MoviesListDto } from './dto';
import { MoviesList } from './types';

@Injectable()
export class MoviesListsService {
  constructor(
    private prismaService: PrismaService,
    private tmdbService: TMDBService
  ) { }

  // async createList(userId: number, dto: MoviesListDto): Promise<void> {
  //   const list = await this.prismaService.moviesList.findUnique({
  //     where: {
  //       userList: {
  //         user_id: userId,
  //         list_name: dto.listName
  //       }
  //     }
  //   });

  //   if (list) {
  //     throw new ForbiddenException(`List '${dto.listName}' already exists`);
  //   }

  //   const newList = await this.prismaService.moviesList.create({
  //     data: {
  //       user_id: userId,
  //       list_name: dto.listName,
  //       is_public: dto.isPublic
  //     }
  //   });
  // }

  // async addMovieToList(userId: number, dto: ListMovieDto): Promise<void> {
  //   const list = await this.prismaService.moviesList.findUnique({
  //     where: {
  //       id: dto.listId
  //     }
  //   });

  //   if (!list) {
  //     throw new NotFoundException('List Not Found.');
  //   }
  //   if (list.user_id !== userId) {
  //     throw new ForbiddenException('Access Denied.');
  //   }

  //   await this.prismaService.movieInList.upsert({
  //     where: {
  //       movieInList: {
  //         list_id: dto.listId,
  //         tmdb_id: dto.movieId
  //       }
  //     },
  //     create: {
  //       tmdb_id: dto.movieId,
  //       list_id: dto.listId
  //     },
  //     update: {}
  //   });
  // }

  async addMovieToFavourites(userId: number, dto: FavouriteDto): Promise<void> {
    await this.prismaService.favourites.upsert({
      where: {
        userFavourite: {
          user_id: userId,
          tmdb_id: dto.movieId
        }
      },
      create: {
        user_id: userId,
        tmdb_id: dto.movieId
      },
      update: {}
    });
  }

  async removeMovieFromFavourites(userId: number, movieId: string): Promise<void> {
    await this.prismaService.favourites.delete({
      where: {
        userFavourite: {
          user_id: userId,
          tmdb_id: movieId
        }
      }
    });
  }

  async getFavourites(userId: number): Promise<MoviesList> {
    const moviesIds = await this.prismaService.favourites.findMany({
      where: {
        user_id: userId
      },
      select: {
        tmdb_id: true
      }
    }).then(results => results.map(item => item.tmdb_id));

    const movies = await Promise.all(
      moviesIds.map(id => this.tmdbService.getMovie(id))
    );

    return {
      userId: userId,
      listName: 'Favourites',
      movies: movies
    }
  }

  async isFavourite(userId: number, movieId: string): Promise<boolean> {
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

  // async getList(listId: number, currentUserId: number): Promise<MoviesList> {
  //   const list = await this.prismaService.moviesList.findUnique({
  //     where: {
  //       id: listId
  //     }
  //   });

  //   if (!list) {
  //     throw new NotFoundException('List Not Found.');
  //   }
  //   if (!list.is_public && list.user_id !== currentUserId) {
  //     throw new ForbiddenException('Access Denied.');
  //   }

  //   const moviesIds = await this.prismaService.movieInList.findMany({
  //     where: {
  //       list_id: list.id
  //     },
  //     select: {
  //       tmdb_id: true
  //     }
  //   }).then(results => results.map(item => item.tmdb_id));

  //   const movies = await Promise.all(
  //     moviesIds.map(id => this.tmdbService.getMovie(id))
  //   );

  //   return {
  //     userId: list.user_id,
  //     listId: list.id,
  //     listName: list.list_name,
  //     isPublic: list.is_public,
  //     movies: movies
  //   }
  // }

  // async getAllUserLists(userId: number, currentUserId: number): Promise<MoviesList[]> {
  //   const lists = await this.prismaService.moviesList.findMany({
  //     where: {
  //       user_id: userId
  //     }
  //   }).then(
  //     results => results.filter(list => list.is_public || list.user_id === currentUserId)
  //   );

  //   return lists.reduce(
  //     (prev, curr) => {
  //       prev.push(this.getList(curr.id, currentUserId));
  //       return prev
  //     }, []
  //   );
  // }
}
