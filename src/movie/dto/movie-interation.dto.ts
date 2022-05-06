import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class MovieInteractionDto {
  @IsNotEmpty()
  @IsNumber()
  movieId: number;

  @IsOptional()
  @IsNumber()
  @Max(5)
  @Min(1)
  rating?: number;
}