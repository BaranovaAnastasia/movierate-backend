import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { Movie } from 'src/common/types';
import { FavouriteDto } from './dto';
import { FavouritesService } from './favourites.service';

@Controller('favourites')
export class FavouritesController {
  constructor(
    private favouritesService: FavouritesService
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  addMovieToFavourites(
    @GetCurrentUserId() userId: number,
    @Body() dto: FavouriteDto
  ): Promise<void> {
    return this.favouritesService.addMovieToFavourites(userId, dto.movieId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  removeMovieFromFavourites(
    @GetCurrentUserId() userId: number,
    @Param('id') movieId: string
  ): Promise<void> {
    return this.favouritesService.removeMovieFromFavourites(userId, movieId);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getFavourites(@Param('id') userId: number): Promise<Movie[]> {
    return this.favouritesService.getFavourites(Number(userId));
  }

  @Get('isfavourite/:id')
  @HttpCode(HttpStatus.OK)
  isFavourite(
    @GetCurrentUserId() userId: number,
    @Param('id') movieId: any
  ): Promise<boolean> {
    return this.favouritesService.isFavourite(userId, movieId);
  }
}
