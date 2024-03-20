import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/shared/database/schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SignInRequired } from 'src/shared/middlewares/authentication/authentication.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignInRequired).forRoutes('/user-auth');
  }
}
