export type Movie = {
  id: string,
  title: string,
  release_date: Date,
  poster_path: string,
  
  vote_average?: number,
  vote_count?: number,
  watched?: number,
}