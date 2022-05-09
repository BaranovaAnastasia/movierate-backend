import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ListMovieDto {
  @IsNotEmpty()
  @IsString()
  movieId: string;

  @IsNotEmpty()
  @IsNumber()
  listId: number;
}