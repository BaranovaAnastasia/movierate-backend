import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';
import { HttpModule } from '@nestjs/axios';
import { TMDBService } from 'src/common/services';
import { CommonService } from 'src/common/services';

@Module({
  imports: [HttpModule],
  providers: [FavouritesService, TMDBService, CommonService],
  controllers: [FavouritesController]
})
export class FavouritesModule {}
