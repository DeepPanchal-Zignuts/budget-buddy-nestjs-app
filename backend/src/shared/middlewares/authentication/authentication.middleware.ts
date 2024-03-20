import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import {
  JWT,
  RESPONSE_MESSAGES,
  SUCCESS_RESPONSE,
} from 'src/shared/constants/messages.constants';
import {
  UserDocument,
  UserModel,
} from 'src/shared/database/schemas/user.schema';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Injectable()
export class SignInRequired implements NestMiddleware {
  constructor(
    @InjectModel(UserModel) private readonly userModel: Model<UserDocument>,
    private config: ConfigService,
  ) {}
  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      // Verify the Token
      const decode = JWT.verify(
        req.headers['authorization'],
        this.config.get('JWT_SECRET_KEY'),
      );

      // Check for user by ID
      const isExistingUser = await this.userModel.findOne({ _id: decode._id });

      //If user not exists
      if (!isExistingUser) {
        throw new NotFoundException();
      }

      req.user = decode;
      //calling the next function
      return next();
    } catch (error) {
      // Handle NotFoundException here and return custom message
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: SUCCESS_RESPONSE.SUCCESS_FALSE,
            message: RESPONSE_MESSAGES.USER_NOT_FOUND,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      // Else Server Error
      throw new InternalServerErrorException();
    }
  }
}
