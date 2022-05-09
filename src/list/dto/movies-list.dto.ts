import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MoviesListDto {
  @IsOptional()
  listId: number;

  @IsNotEmpty()
  @IsString()
  listName: string;

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;
}