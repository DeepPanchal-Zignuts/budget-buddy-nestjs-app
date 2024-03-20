import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExpenseModel,
  ExpenseSchema,
} from 'src/shared/database/schemas/expense.schema';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { SignInRequired } from 'src/shared/middlewares/authentication/authentication.middleware';
import { UserModule } from '../user/user.module';
import {
  AccountModel,
  AccountSchema,
} from 'src/shared/database/schemas/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ExpenseModel, schema: ExpenseSchema }]),
    MongooseModule.forFeature([{ name: AccountModel, schema: AccountSchema }]),
    UserModule,
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [MongooseModule],
})
export class ExpenseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignInRequired).forRoutes('api/v1/expense');
  }
}
