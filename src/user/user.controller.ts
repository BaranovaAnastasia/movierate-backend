import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { Profile } from 'src/common/types';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(private userService: UserService) { }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: number): Promise<Profile> {
    return this.userService.getUserById(Number(id));
  }
}
