import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  avatar_path: string;
}