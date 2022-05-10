import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { MoviesListsModule } from './list/movies-lists.module';
import { MovieModule } from './movie/movie.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { FavouritesModule } from './favourites/favourites.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    PrismaModule,
    MovieModule,
    ReviewModule,
    MoviesListsModule,
    FavouritesModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: AtGuard }
  ]
})
export class AppModule { }
