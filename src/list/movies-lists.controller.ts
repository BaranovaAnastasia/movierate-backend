import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { ListMovieDto, MoviesListDto } from './dto';
import { MoviesListsService } from './movies-lists.service';
import { MoviesList } from './types';

@Controller('lists')
export class MoviesListsController {
  constructor(
    private moviesListsService: MoviesListsService
  ) { }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  createList(
    @GetCurrentUserId() userId: number,
    @Body() dto: MoviesListDto
  ): Promise<MoviesList> {
    return this.moviesListsService.createList(userId, dto);
  }

  @Post('add')
  @HttpCode(HttpStatus.OK)
  addMovieToList(
    @GetCurrentUserId() userId: number,
    @Body() dto: ListMovieDto
  ): Promise<MoviesList> {
    return this.moviesListsService.addMovieToList(userId, dto);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  getList(
    @GetCurrentUserId() userId: number,
    @Query() query
  ): Promise<MoviesList> {
    return this.moviesListsService.getList(Number(query.list_id), userId);
  }

  @Public()
  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  getAllUserLists(
    @GetCurrentUserId() currentUserId: number,
    @Param() id: number
  ): Promise<MoviesList[]> {
    return this.moviesListsService.getAllUserLists(id, currentUserId);
  }
}
