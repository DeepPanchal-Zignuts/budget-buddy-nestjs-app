import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { UpdateAccountDTO } from './dto/update-account.dto';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/get-accounts/:id')
  getAllAccounts(@Param() userId: string) {
    return this.accountService.getAllAccounts(userId);
  }

  @Post('/add-account')
  createAccount(@Body() createAccountDto: CreateAccountDTO) {
    return this.accountService.createAccount(createAccountDto);
  }

  @Patch('/update-account/:id')
  updateAccount(
    @Body() updateAccountDto: UpdateAccountDTO,
    @Param() userId: string,
  ) {
    return this.accountService.updateAccount(updateAccountDto, userId);
  }

  @Delete('/delete-account/:id')
  deleteAccount(@Param() userId: string) {
    return this.accountService.deleteAccount(userId);
  }
}
