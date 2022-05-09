import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListMovieDto, MoviesListDto } from './dto';
import { MoviesList } from './types';

@Injectable()
export class MoviesListsService {
  constructor(private prismaService: PrismaService) { }

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

    const newList = await this.prismaService.moviesList.create({
      data: {
        user_id: userId,
        list_name: dto.listName,
        is_public: dto.isPublic
      }
    });

    return {
      userId: newList.user_id,
      listId: newList.id,
      listName: newList.list_name,
      isPublic: newList.is_public,
      moviesIds: []
    };
  }

  async addMovieToList(userId: number, dto: ListMovieDto): Promise<MoviesList> {
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

    return this.getList(dto.listId, userId);
  }

  async getList(listId: number, currentUserId: number): Promise<MoviesList> {
    const list = await this.prismaService.moviesList.findUnique({
      where: {
        id: listId
      }
    });

    if (!list) {
      throw new NotFoundException('List Not Found.');
    }
    if (!list.is_public && list.user_id !== currentUserId) {
      throw new ForbiddenException('Access Denied.');
    }

    const moviesIds = await this.prismaService.movieInList.findMany({
      where: {
        list_id: list.id
      },
      select: {
        tmdb_id: true
      }
    }).then(results => results.map(id => id.tmdb_id));

    return {
      userId: list.user_id,
      listId: list.id,
      listName: list.list_name,
      isPublic: list.is_public,
      moviesIds: moviesIds
    }
  }

  async getAllUserLists(userId: number, currentUserId: number): Promise<MoviesList[]> {
    const lists = await this.prismaService.moviesList.findMany({
      where: {
        user_id: userId
      }
    }).then(
      results => results.filter(list => list.is_public || list.user_id === currentUserId)
    );

    return lists.reduce(
      (prev, curr) => {
        prev.push(this.getList(curr.id, currentUserId));
        return prev
      }, []
    );
  }
}
