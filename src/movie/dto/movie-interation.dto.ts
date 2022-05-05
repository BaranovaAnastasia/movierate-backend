import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class MovieInteractionDto {
  @IsNotEmpty()
  @IsNumber()
  movieId: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(5)
  @Min(1)
  rating?: number;
}