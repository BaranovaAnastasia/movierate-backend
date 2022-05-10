import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { ListMovieDto, MoviesListDto } from './dto';
import { MoviesListsService } from './movies-lists.service';
import { MoviesList } from './types';

@Controller('lists')
export class MoviesListsController {
  constructor(
    private moviesListsService: MoviesListsService
  ) { }

  @Get('all/current')
  @HttpCode(HttpStatus.OK)
  getAllListsCurrentUser(@GetCurrentUserId() userId: number): Promise<MoviesList[]> {
    return this.moviesListsService.getAllUserLists(userId, userId);
  }

  @Public()
  @Get('all/:id')
  @HttpCode(HttpStatus.OK)
  getAllListsUser(
    @GetCurrentUserId() currentUserId: number,
    @Param('id') userId: number
  ): Promise<MoviesList[]> {
    return this.moviesListsService.getAllUserLists(Number(userId), currentUserId);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getList(
    @GetCurrentUserId() currentUserId: number,
    @Param('id') listId: number
  ): Promise<MoviesList> {
    return this.moviesListsService.getList(Number(listId), currentUserId);
  }

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
  ): Promise<void> {
    return this.moviesListsService.addMovieToList(userId, dto);
  }

  @Post('remove')
  @HttpCode(HttpStatus.OK)
  removeMovieFromList(
    @GetCurrentUserId() userId: number,
    @Body() dto: ListMovieDto
  ): Promise<void> {
    return this.moviesListsService.removeMovieFromList(userId, dto);
  }

  @Post('edit/:id')
  @HttpCode(HttpStatus.OK)
  editList(
    @GetCurrentUserId() userId: number,
    @Param('id') listId: number,
    @Body() dto: MoviesListDto
  ): Promise<void> {
    return this.moviesListsService.editList(userId, Number(listId), dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteList(
    @GetCurrentUserId() userId: number,
    @Param('id') listId: number
  ): Promise<void> {
    return this.moviesListsService.deleteList(userId, Number(listId));
  }
}
