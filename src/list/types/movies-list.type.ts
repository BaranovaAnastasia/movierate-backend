import { Movie } from "src/common/types";

export type MoviesList = {
  userId: number;
  listId?: number;
  listName: string;
  isPublic?: boolean;
  movies: Movie[];
}