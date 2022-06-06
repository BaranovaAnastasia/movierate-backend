import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TMDBService } from 'src/common/services';
import { MoviesListsController } from './movies-lists.controller';
import { MoviesListsService } from './movies-lists.service';

@Module({
  imports: [HttpModule],
  controllers: [MoviesListsController],
  providers: [MoviesListsService, TMDBService]
})
export class MoviesListsModule {}
