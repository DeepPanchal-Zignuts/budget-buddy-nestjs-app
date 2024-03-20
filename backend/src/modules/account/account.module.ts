import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccountModel,
  AccountSchema,
} from 'src/shared/database/schemas/account.schema';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { SignInRequired } from 'src/shared/middlewares/authentication/authentication.middleware';
import {
  ExpenseModel,
  ExpenseSchema,
} from 'src/shared/database/schemas/expense.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AccountModel, schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: ExpenseModel, schema: ExpenseSchema }]),
    UserModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [MongooseModule],
})
export class AccountModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignInRequired).forRoutes('api/v1/account');
  }
}
