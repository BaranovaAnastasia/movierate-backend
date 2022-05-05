import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { TMDBService } from './tmdb.service';

@Module({
  imports: [HttpModule],
  controllers: [MovieController],
  providers: [MovieService, TMDBService]
})
export class MovieModule {}
