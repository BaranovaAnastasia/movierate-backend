import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable } from 'rxjs';
import { TMDBService } from 'src/common/services';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListMovieDto, MoviesListDto } from './dto';
import { MoviesList } from './types';

@Injectable()
export class MoviesListsService {
  constructor(
    private prismaService: PrismaService,
    private tmdbService: TMDBService
  ) { }

  async createList(userId: number, dto: MoviesListDto): Promise<MoviesList> {
    const list = await this.prismaService.moviesList.findUnique({
      where: {
        userList: {
          user_id: userId,
          list_name: dto.listName
        }
      }
    });

    if (list) {
      throw new ForbiddenException(`List '${dto.listName}' already exists`);
    }

    return this.prismaService.moviesList.create({
      data: {
        user_id: userId,
        list_name: dto.listName,
        is_public: dto.isPublic
      }
    })
      .then(newList => {
        return {
          userId: newList.user_id,
          listId: newList.id,
          listName: newList.list_name,
          isPublic: newList.is_public,
          movies: []
        }
      });
  }

  async addMovieToList(userId: number, dto: ListMovieDto): Promise<void> {
    const list = await this.prismaService.moviesList.findUnique({
      where: {
        id: dto.listId
      }
    });

    if (!list) {
      throw new NotFoundException('List Not Found.');
    }
    if (list.user_id !== userId) {
      throw new ForbiddenException('Access Denied.');
    }

    await this.prismaService.movieInList.upsert({
      where: {
        movieInList: {
          list_id: dto.listId,
          tmdb_id: dto.movieId
        }
      },
      create: {
        tmdb_id: dto.movieId,
        list_id: dto.listId
      },
      update: {}
    });
  }

  async removeMovieFromList(userId: number, dto: ListMovieDto): Promise<void> {
    const list = await this.prismaService.moviesList.findUnique({
      where: {
        id: dto.listId
      }
    });

    if (!list) {
      throw new NotFoundException('List Not Found.');
    }

    if (list.user_id !== userId) {
      throw new ForbiddenException('Access Denied.');
    }

    await this.prismaService.movieInList.delete({
      where: {
        movieInList: {
          list_id: dto.listId,
          tmdb_id: dto.movieId
        }
      }
    });
  }

  async getList(listId: number, currentUserId: number): Promise<MoviesList> {
    const list = await this.prismaService.moviesList.findUnique({
      where: { id: listId }
    });

    if (!list) {
      throw new NotFoundException('List Not Found.');
    }
    if (!list.is_public && list.user_id !== currentUserId) {
      throw new ForbiddenException('Access Denied.');
    }

    const moviesIds = await this.prismaService.movieInList.findMany({
      where: { list_id: listId },
      select: { tmdb_id: true }
    }).then(results => results.map(item => item.tmdb_id));

    const movies = await Promise.all(
      moviesIds.map(id => this.tmdbService.getMovie(id))
    );

    return {
      userId: list.user_id,
      listId: list.id,
      listName: list.list_name,
      isPublic: list.user_id === currentUserId ? list.is_public : undefined,
      movies: movies
    }
  }

  async getAllUserLists(userId: number, currentUserId: number): Promise<MoviesList[]> {
    return this.prismaService.moviesList.findMany({
      where: {
        user_id: userId
      },
      orderBy: {
        created_at: 'desc'
      }
    })
      .then(
        results => results.filter(
          list => list.is_public || list.user_id === currentUserId
        )
      )
      .then(
        results => results.map(list => {
          return {
            userId: userId,
            listId: list.id,
            listName: list.list_name,
            isPublic: list.user_id === currentUserId ? list.is_public : undefined
          }
        })
      );
  }

  async editList(userId: number, listId: number, dto: MoviesListDto): Promise<void> {
    try {
      await this.prismaService.moviesList.updateMany({
        where: {
          id: listId,
          user_id: userId
        },
        data: {
          list_name: dto.listName,
          is_public: dto.isPublic
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(`List '${dto.listName}' already exists`);
        }
      }
    }
  }

  async deleteList(userId: number, listId: number): Promise<void> {
    await this.prismaService.movieInList.deleteMany({
      where: {
        list_id: listId
      }
    });
    
    await this.prismaService.moviesList.deleteMany({
      where: {
        id: listId,
        user_id: userId
      }
    });
  }
}
