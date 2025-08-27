import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/auth/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

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

  @Patch('/:id/un-ban')
  unBanUSer(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.unBanUser(id);
  }

  @Patch('/:id/role')
  changeRole(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.changeRole(id);
  }

  @Put('/:id')
  updateInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<void> {
    return this.userService.updateInfo(id, createUserDto);
  }

  @Delete('/:id')
  removeUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.removeUser(id);
  }
}
