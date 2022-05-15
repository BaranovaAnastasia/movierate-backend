export type MovieStats = {
  movieId: string,
  voteAvg: number,
  voteCount: number,
  watched: number,

  currentRating?: number,
  isWatched?: boolean,
  isFavourite?: boolean
}