import { Credits, Trailer } from "."

export interface TMDBMovie {
  id: string,
  title: string,
  release_date: Date,
  poster_path: string,
  runtime: number,
  overview: string,
  genres: {
    name: string
  }[],
  tagline: string,
  production_countries: {
    name: string
  },
  popularity?: number,

  trailer?: Trailer,
  credits?: Credits,
}