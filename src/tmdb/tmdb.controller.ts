import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Public } from 'src/common/decorators';
import { Movie } from 'src/common/types';
import { TmdbService } from './tmdb.service';
import { Credits, Trailer } from './types';

@Controller('tmdb')
export class TmdbController {
  constructor(private tmdbService: TmdbService) {}


  @Public()
  @Get('popular')
  @HttpCode(HttpStatus.OK)
  getPopular(): Observable<Movie[]> {
    return this.tmdbService.getPopular();
  }

  @Public()
  @Get('upcoming')
  @HttpCode(HttpStatus.OK)
  getUpcoming(): Observable<Movie[]> {
    return this.tmdbService.getUpcoming();
  }

  @Public()
  @Get('movie/:id')
  @HttpCode(HttpStatus.OK)
  getMovie(@Param('id') movieId: string): Observable<Movie> {
    return this.tmdbService.getMovie(movieId);
  }

  @Public()
  @Get('trailer/:id')
  @HttpCode(HttpStatus.OK)
  getTrailer(@Param('id') movieId: string): Observable<Trailer> {
    return this.tmdbService.getTrailer(movieId);
  }

  @Public()
  @Get('credits/:id')
  @HttpCode(HttpStatus.OK)
  getCredits(@Param('id') movieId: string): Observable<Credits> {
    return this.tmdbService.getCredits(movieId);
  }

  @Public()
  @Get('search')
  @HttpCode(HttpStatus.OK)
  searchMovies(@Query() query: any): Observable<Movie[]> {
    return this.tmdbService.searchMovies(encodeURI(query.term), query.page);
  }
}
