import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewDto {
  @IsNotEmpty()
  movie_id: number;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  review: string;

  @Optional()
  created_at: Date;
  @Optional()
  user_id: number;
  @Optional()
  user_name: string;
  @Optional()
  avatar_path: string;
}