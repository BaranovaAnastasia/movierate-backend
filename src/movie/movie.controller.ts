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
  markAsWatched(@Body() dto: MovieInteractionDto) {
  }

  @Get('/iswatched/:id')
  @HttpCode(HttpStatus.OK)
  isWatched(
    @GetCurrentUserId() userId: number,
    @Param('id') movieId: number
  ): Promise<boolean> {
    return this.movieService.isWatched(userId, Number(movieId));
  }

  @Public()
  @Get('/stats/:id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: number): Promise<MovieStats> {
    return this.movieService.getStats(Number(id));
  }

}
