import { Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/auth/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Patch('/:id/ban')
  banUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.banUser(id);
  }
}
