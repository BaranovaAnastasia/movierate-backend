import { IsNotEmpty, IsString } from 'class-validator';

export class FavouriteDto {
  @IsNotEmpty()
  @IsString()
  movieId: string;
}