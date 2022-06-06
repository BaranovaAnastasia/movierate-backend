import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { Movie, MovieStats } from 'src/common/types';
import { WatchedService } from './watched.service';

@Controller('watched')
export class WatchedController {
  constructor(private watchedService: WatchedService) { }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getWatched(@Param('id') userId: number): Promise<Movie[]> {
    return this.watchedService.getWatched(Number(userId));
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  watchMovie(
    @GetCurrentUserId() userId: number,
    @Param('id') movieId: string
  ): Promise<MovieStats> {
    return this.watchedService.watchMovie(userId, movieId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  unwatchMovie(
    @GetCurrentUserId() userId: number,
    @Param('id') movieId: string
  ): Promise<MovieStats> {
    return this.watchedService.unwatchMovie(userId, movieId);
  }
}
