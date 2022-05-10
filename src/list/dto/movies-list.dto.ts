import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class MoviesListDto {
  @IsNotEmpty()
  @IsString()
  listName: string;

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;
}