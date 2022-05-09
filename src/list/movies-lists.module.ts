import { Module } from '@nestjs/common';
import { MoviesListsController } from './movies-lists.controller';
import { MoviesListsService } from './movies-lists.service';

@Module({
  controllers: [MoviesListsController],
  providers: [MoviesListsService]
})
export class MoviesListsModule {}
