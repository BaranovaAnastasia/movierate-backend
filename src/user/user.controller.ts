import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { UserGenresStats, UserStats } from '@prisma/client';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { Profile } from 'src/common/types';
import { UserTopEntry } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(private userService: UserService) { }

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

  @Public()
  @Get('top')
  @HttpCode(HttpStatus.OK)
  getUserTop(@Query() query): Promise<UserTopEntry[]> {
    return this.userService.getUserTop(query.by, query.limit);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(
    @GetCurrentUserId() currentUserId: number,
    @Param('id') id: number
  ): Promise<Profile> {
    return this.userService.getUserById(Number(id), currentUserId);
  }

  @Post('follow/:id')
  @HttpCode(HttpStatus.OK)
  followUser(
    @GetCurrentUserId() currentUserId: number,
    @Param('id') id: number
  ): Promise<void> {
    return this.userService.follow(currentUserId, Number(id));
  }

  @Post('unfollow/:id')
  @HttpCode(HttpStatus.OK)
  unfollowUser(
    @GetCurrentUserId() currentUserId: number,
    @Param('id') id: number
  ): Promise<void> {
    return this.userService.unfollow(currentUserId, Number(id));
  }

  @Public()
  @Get('following/:id')
  @HttpCode(HttpStatus.OK)
  getFollowing(@Param('id') id: number): Promise<Profile[]> {
    return this.userService.getAllFollowing(Number(id));
  }

  @Public()
  @Get('followedBy/:id')
  @HttpCode(HttpStatus.OK)
  getFollowedBy(@Param('id') id: number): Promise<Profile[]> {
    return this.userService.getAllFollowedBy(Number(id));
  }
}
