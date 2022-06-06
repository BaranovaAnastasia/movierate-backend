import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { FeedService } from './feed.service';
import { UserAction } from './types/action.type';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) { }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserAction(@Param('id') userId: number): Promise<UserAction[]> {
    return this.feedService.getUserAction(Number(userId));
  }
}
