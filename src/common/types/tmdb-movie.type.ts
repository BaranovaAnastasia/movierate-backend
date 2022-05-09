import { Genre } from "src/common/types"

export type TMBDMovie = {
  id: string,
  title: string,
  release_date: Date,
  poster_path: string,
  runtime?: number,
  genres?: Genre[]
}