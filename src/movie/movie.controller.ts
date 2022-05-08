import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { MovieInteractionDto } from './dto';
import { MovieService } from './movie.service';
import { MovieStats } from './types';

@Controller('movie')
export class MovieController {

  constructor(private movieService: MovieService) { }

  @Post('/rate')
  @HttpCode(HttpStatus.OK)
  rateMovie(
    @GetCurrentUserId() userId: number,
    @Body() dto: MovieInteractionDto
  ): Promise<MovieStats> {
    return this.movieService.rateMovie(userId, dto);
  }

  @Post('/watch')
  @HttpCode(HttpStatus.OK)
  watchMovie(
    @GetCurrentUserId() userId: number,
    @Body() dto: MovieInteractionDto
  ): Promise<MovieStats>  {
    return this.movieService.watchMovie(userId, dto);
  }

  @Post('/unwatch')
  @HttpCode(HttpStatus.OK)
  unwatchMovie(
    @GetCurrentUserId() userId: number,
    @Body() dto: MovieInteractionDto
  ): Promise<MovieStats>  {
    return this.movieService.unwatchMovie(userId, dto);
  }

  @Get('/rating/:id')
  @HttpCode(HttpStatus.OK)
  rating(
    @GetCurrentUserId() userId: number,
    @Param('id') movieId: string
  ): Promise<number> {
    return this.movieService.getRating(userId, movieId);
  }

  @Get('/iswatched/:id')
  @HttpCode(HttpStatus.OK)
  isWatched(
    @GetCurrentUserId() userId: number,
    @Param('id') movieId: string
  ): Promise<boolean> {
    return this.movieService.isWatched(userId, movieId);
  }

  @Public()
  @Get('/stats/:id')
  @HttpCode(HttpStatus.OK)
  getStats(@Param('id') id: string): Promise<MovieStats> {
    return this.movieService.getStats(id);
  }

  @Public()
  @Get('/top')
  @HttpCode(HttpStatus.OK)
  getTopRatedMovies(): Promise<any> {
    return this.movieService.getTopRatedMovies();
  }

}
