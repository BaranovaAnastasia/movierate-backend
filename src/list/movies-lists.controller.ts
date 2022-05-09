import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { FavouriteDto, ListMovieDto, MoviesListDto } from './dto';
import { MoviesListsService } from './movies-lists.service';
import { MoviesList } from './types';

@Controller('lists')
export class MoviesListsController {
  constructor(
    private moviesListsService: MoviesListsService
  ) { }

  @Post('favourite')
  @HttpCode(HttpStatus.OK)
  addMovieToFavourites(
    @GetCurrentUserId() userId: number,
    @Body() dto: FavouriteDto
  ): Promise<void> {
    return this.moviesListsService.addMovieToFavourites(userId, dto);
  }

  @Delete('favourite/:id')
  @HttpCode(HttpStatus.OK)
  removeMovieFromFavourites(
    @GetCurrentUserId() userId: number,
    @Param('id') movieId: string
  ): Promise<void> {
    return this.moviesListsService.removeMovieFromFavourites(userId, movieId);
  }

  @Public()
  @Get('favourite/:id')
  @HttpCode(HttpStatus.OK)
  getFavourites(@Param('id') userId: number): Promise<MoviesList> {
    return this.moviesListsService.getFavourites(Number(userId));
  }

  @Get('isfavourite/:id')
  @HttpCode(HttpStatus.OK)
  isFavourite(
    @GetCurrentUserId() userId: number,
    @Param('id') movieId: any
  ): Promise<boolean> {
    return this.moviesListsService.isFavourite(userId, movieId);
  }
}
