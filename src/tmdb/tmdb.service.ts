import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Movie } from 'src/common/types';
import { Credits, TMDBCredits, TMDBMovie, TMDBMoviesList, TMDBSearchResult, TMDBVideos, Trailer } from './types';

export function constructRequestUrl(
  host: string,
  path: string,
  param?: string,
  query?: any
): string {
  const result = `${host}${path}${param ? param : ''}`;
  if (query) {
    return Object.keys(query).reduce(
      (result, key) => result += `${key}=${query[key]}&`,
      `${result}?`
    );
  }
  return result;
}

function TMDBMovie2Movie(tmdbMovie: TMDBMovie): Movie {
  return Object.assign(
    { ...tmdbMovie },
    {
      id: String(tmdbMovie.id),
      poster_path: tmdbMovie.poster_path ? `${process.env.TMDB_POSTER_URL}/${tmdbMovie.poster_path}` : undefined
    },
    tmdbMovie.genres && { genres: tmdbMovie.genres.map(genre => genre.name).slice(0, 2) }
  );
}

@Injectable()
export class TmdbService {
  constructor(
    private httpService: HttpService
  ) { }

  getPopular(): Observable<Movie[]> {
    return this.httpService.get<TMDBMoviesList>(
      constructRequestUrl(
        process.env.TMDB_URL,
        '/movie/popular',
        undefined,
        { 'api_key': process.env.TMDB_API_KEY }
      )
    ).pipe(map(result => result.data.results.map(movie => TMDBMovie2Movie(movie))));
  }

  getUpcoming(): Observable<Movie[]> {
    const today = new Date();
    const todayReq = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    return this.httpService.get<TMDBMoviesList>(
      constructRequestUrl(
        process.env.TMDB_URL,
        '/discover/movie',
        undefined,
        {
          'api_key': process.env.TMDB_API_KEY,
          'primary_release_date.gte': todayReq
        }
      )
    ).pipe(map(result => result.data.results.map(movie => TMDBMovie2Movie(movie))));
  }

  getMovie(movieId: string): Observable<Movie> {
    return this.httpService.get<TMDBMovie>(
      constructRequestUrl(
        process.env.TMDB_URL,
        '/movie',
        `/${movieId}`,
        { 'api_key': process.env.TMDB_API_KEY }
      )
    ).pipe(map(result => TMDBMovie2Movie(result.data)));
  }

  getTrailer(movieId: string): Observable<Trailer> {
    return this.httpService.get<TMDBVideos>(
      constructRequestUrl(
        process.env.TMDB_URL,
        '/movie',
        `/${movieId}/videos`,
        { 'api_key': process.env.TMDB_API_KEY }
      )
    ).pipe(
      map(result => result.data.results.find(video => video.type === 'Trailer'))
    );
  }

  getCredits(movieId: string): Observable<Credits> {
    return this.httpService.get<TMDBCredits>(
      constructRequestUrl(
        process.env.TMDB_URL,
        '/movie',
        `/${movieId}/credits`,
        { 'api_key': process.env.TMDB_API_KEY }
      )
    ).pipe(
      map(result => Object.assign(
        {
          cast: result.data.cast
            .filter(member => member.order < 4)
            .map(value => value.name)
        },
        {
          directors: result.data.crew
            .filter(member => member.job === 'Director')
            .map(value => value.name)
        },
        {
          writers: result.data.crew
            .filter(member => member.department === 'Writing')
            .map(value => value.name)
        }
      ))
    );
  }

  searchMovies(term: string, page: number): Observable<Movie[]> {
    return this.httpService.get<TMDBSearchResult>(
      constructRequestUrl(
        process.env.TMDB_URL,
        '/search/movie',
        undefined,
        {
          'api_key': process.env.TMDB_API_KEY,
          'query': term,
          'page': page
        }
      )
    ).pipe(
      map(result => result.data.results),
      map(result => result.sort(
        (a, b) => a.popularity && b.popularity ? b.popularity - a.popularity : 0
      )),
      map(result => result.map(tmdbMovie => TMDBMovie2Movie(tmdbMovie)))
    );
  }
}
