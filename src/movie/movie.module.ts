import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TMDBService } from 'src/common/services';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  imports: [HttpModule],
  controllers: [MovieController],
  providers: [MovieService, TMDBService]
})
export class MovieModule {}
