import { TMDBMovie } from ".";

export interface TMDBSearchResult {
  page: number,
  results: TMDBMovie[],
  total_results: number,
  total_pages: number
}