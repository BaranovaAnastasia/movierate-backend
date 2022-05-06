import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserGenresStats, UserStats } from '@prisma/client';
import { Public } from 'src/common/decorators';
import { Profile } from 'src/common/types';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(private userService: UserService) { }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: number): Promise<Profile> {
    return this.userService.getUserById(Number(id));
  }

  @Public()
  @Get('stats/:id')
  @HttpCode(HttpStatus.OK)
  getUserStats(@Param('id') id: number): Promise<UserStats> {
    return this.userService.getUserStats(Number(id));
  }

  @Public()
  @Get('genres/:id')
  @HttpCode(HttpStatus.OK)
  getUserGenresStats(@Param('id') id: number): Promise<UserGenresStats[]> {
    return this.userService.getUserGenresStats(Number(id));
  }
}
