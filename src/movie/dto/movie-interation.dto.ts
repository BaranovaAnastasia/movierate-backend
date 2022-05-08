import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class MovieInteractionDto {
  @IsNotEmpty()
  @IsString()
  movieId: string;

  @IsOptional()
  @IsNumber()
  @Max(5)
  @Min(1)
  rating?: number;
}