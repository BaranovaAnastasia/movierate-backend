import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CommonService } from 'src/common/services';
import { TMDBService } from 'src/common/services';
import { WatchedController } from './watched.controller';
import { WatchedService } from './watched.service';

@Module({
  imports: [HttpModule],
  controllers: [WatchedController],
  providers: [WatchedService, TMDBService, CommonService]
})
export class WatchedModule {}
