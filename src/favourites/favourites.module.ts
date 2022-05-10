import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';
import { HttpModule } from '@nestjs/axios';
import { TMDBService } from 'src/common/services';

@Module({
  imports: [HttpModule],
  providers: [FavouritesService, TMDBService],
  controllers: [FavouritesController]
})
export class FavouritesModule {}
