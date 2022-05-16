import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TMDBService } from 'src/common/services';
import { TmdbController } from './tmdb.controller';
import { TmdbService } from './tmdb.service';

@Module({
  imports: [HttpModule],
  controllers: [TmdbController],
  providers: [TmdbService, TMDBService]
})
export class TmdbModule {}
