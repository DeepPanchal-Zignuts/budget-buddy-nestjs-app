import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AccountModule } from './modules/account/account.module';
import { AccountService } from './modules/account/account.service';
import { ExpenseService } from './modules/expense/expense.service';
import { ExpenseModule } from './modules/expense/expense.module';
import { DatabaseModule } from './shared/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    RouterModule.register([{ path: 'api/v1/auth', module: UserModule }]),
    AccountModule,
    RouterModule.register([{ path: 'api/v1/account', module: AccountModule }]),
    ExpenseModule,
    RouterModule.register([{ path: 'api/v1/expense', module: ExpenseModule }]),
    DatabaseModule,
  ],

  providers: [AccountService, ExpenseService],
  exports: [UserModule, AccountModule, ExpenseModule, DatabaseModule],
})
export class AppModule {}
