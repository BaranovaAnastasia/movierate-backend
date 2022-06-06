import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CommonService } from 'src/common/services';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { Movie, MovieStats } from 'src/common/types';
import { MovieInteractionDto } from './dto';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {

  constructor(
    private CommonService: CommonService,
    private movieService: MovieService
  ) { }

  @Post('/rate')
  @HttpCode(HttpStatus.OK)
  rateMovie(
    @GetCurrentUserId() userId: number,
    @Body() dto: MovieInteractionDto
  ): Promise<MovieStats> {
    return this.movieService.rateMovie(userId, dto);
  }

  @Public()
  @Get('/rating/:id')
  @HttpCode(HttpStatus.OK)
  rating(
    @GetCurrentUserId() userId: number,
    @Param('id') movieId: string
  ): Promise<number> {
    if(!userId) return undefined;
    return this.CommonService.getRating(userId, movieId);
  }

  @Public()
  @Get('/stats/:id')
  @HttpCode(HttpStatus.OK)
  getStats(
    @GetCurrentUserId() userId: number,
    @Param('id') id: string
  ): Promise<MovieStats> {
    return this.CommonService.getStats(id, userId);
  }

  @Public()
  @Get('/top')
  @HttpCode(HttpStatus.OK)
  getTopRatedMovies(): Promise<Movie[]> {
    return this.movieService.getTopRatedMovies();
  }

}
