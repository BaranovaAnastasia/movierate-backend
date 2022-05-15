import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TMDBService } from 'src/common/services';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [HttpModule],
  controllers: [FeedController],
  providers: [FeedService, TMDBService]
})
export class FeedModule {}
