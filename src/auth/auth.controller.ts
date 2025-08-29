import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.authService.getAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('/me')
  getMe(@Req() req): User {
    const user: User = req.user;
    return user;
  }

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.authService.register(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto): Promise<object> {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  refresh(@Req() req): Promise<string> {
    const user = req.user as User;
    return this.authService.refreshToken(user);
  }
}
