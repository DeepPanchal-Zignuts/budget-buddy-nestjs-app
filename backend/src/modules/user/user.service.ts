import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  HashPassword,
  ComparePassword,
  RESPONSE_MESSAGES,
  SUCCESS_RESPONSE,
  JWT,
} from '../../shared/constants/messages.constants';
import {
  UserDocument,
  UserModel,
} from 'src/shared/database/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

// User Service
@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: Model<UserDocument>,
    private config: ConfigService,
  ) {}

  // User Registration
  async register(createUserDto) {
    try {
      // Hash the Password
      const hashedPassword = await HashPassword(createUserDto.password);

      // Create new user
      const newUser = await this.userModel.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      });

      // User Registered Success
      return {
        success: SUCCESS_RESPONSE.SUCCESS_TRUE,
        statusCode: HttpStatus.CREATED,
        message: RESPONSE_MESSAGES.REGISTRATION_SUCCESS,
        newUser,
      };
    } catch (error) {
      // If Email already exists.
      if (error.code === 11000) {
        throw new HttpException(
          {
            success: SUCCESS_RESPONSE.SUCCESS_FALSE,
            message: RESPONSE_MESSAGES.INVALID_CREDENTIALS,
          },
          HttpStatus.CONFLICT,
        );
      }
      // Else Server Error
      throw new InternalServerErrorException();
    }
  }

  // User Login
  async login(loginUserDto) {
    try {
      // Check if user exists
      const email = loginUserDto.email;
      const user = await this.userModel.findOne(
        { email },
        'name email password',
      );

      //If user not exists
      if (!user) {
        throw new NotFoundException();
      }

      // Compare Passwords
      const isMatch = await ComparePassword(
        loginUserDto.password,
        user.password,
      );

      // if passwords doesn't match
      if (!isMatch) {
        throw new NotFoundException();
      }

      // Token generation
      const id = user.id;
      const token = await JWT.sign(
        {
          _id: id,
        },
        this.config.get('JWT_SECRET_KEY'),
        { expiresIn: '7d' },
      );

      // User Login Success
      return {
        success: SUCCESS_RESPONSE.SUCCESS_TRUE,
        statusCode: HttpStatus.OK,
        message: RESPONSE_MESSAGES.LOGIN_SUCCESS,
        user,
        token,
      };
    } catch (error) {
      // If Email already exists.
      if (error.code === 11000) {
        throw new HttpException(
          {
            success: SUCCESS_RESPONSE.SUCCESS_FALSE,
            message: RESPONSE_MESSAGES.INVALID_CREDENTIALS,
          },
          HttpStatus.CONFLICT,
        );
      }

      // Handle NotFoundException here and return custom message
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: SUCCESS_RESPONSE.SUCCESS_FALSE,
            message: RESPONSE_MESSAGES.INVALID_CREDENTIALS,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      // Else Server Error
      throw new InternalServerErrorException();
    }
  }

  private() {
    // To Make Routes Private
    return {
      ok: true,
    };
  }
}
