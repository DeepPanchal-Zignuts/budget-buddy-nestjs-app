import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  register(@Body() createUserDto: CreateUserDTO) {
    return this.userService.register(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDTO) {
    return this.userService.login(loginUserDto);
  }

  @Get('/user-auth')
  private() {
    return this.userService.private();
  }
}
