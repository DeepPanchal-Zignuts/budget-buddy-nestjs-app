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
  RESPONSE_MESSAGES,
  SUCCESS_RESPONSE,
} from 'src/shared/constants/messages.constants';
import {
  AccountDocument,
  AccountModel,
} from 'src/shared/database/schemas/account.schema';
import {
  ExpenseDocument,
  ExpenseModel,
} from 'src/shared/database/schemas/expense.schema';

// Account Service
@Injectable()
export class AccountService {
  constructor(
    @InjectModel(AccountModel)
    private readonly accountModel: Model<AccountDocument>,
    @InjectModel(ExpenseModel)
    private readonly expenseModel: Model<ExpenseDocument>,
  ) {}

  // Creating Accounts
  async createAccount(createAccountDto) {
    try {
      // Create new account
      const newAccount = await this.accountModel.create(createAccountDto);

      // Account Created Success
      return {
        success: SUCCESS_RESPONSE.SUCCESS_TRUE,
        statusCode: HttpStatus.CREATED,
        message: RESPONSE_MESSAGES.ACCOUNT_CREATE_SUCCESS,
        newAccount,
      };
    } catch (error) {
      // Server Error
      throw new InternalServerErrorException();
    }
  }

  // Fetching Accounts
  async getAllAccounts(userId) {
    try {
      // Find the accounts with its owner
      const accounts = await this.accountModel.find({ owner: userId.id });

      // If acccounts not found
      if (!accounts) {
        throw new NotFoundException();
      }

      // Accounts Fetched Success
      return {
        success: SUCCESS_RESPONSE.SUCCESS_TRUE,
        statusCode: HttpStatus.OK,
        message: RESPONSE_MESSAGES.ACCOUNT_FETCH_SUCCESS,
        accounts,
      };
    } catch (error) {
      // Handle NotFoundException here and return custom message
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: SUCCESS_RESPONSE.SUCCESS_FALSE,
            message: RESPONSE_MESSAGES.ACCOUNT_NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Else Server Error
      throw new InternalServerErrorException();
    }
  }

  // Update Account
  async updateAccount(updateAccountDto, userId) {
    try {
      // Verify if the account with the given id exists
      const existingAccount = await this.accountModel.findOne({
        _id: userId.id,
      });

      // If account doesn't exists
      if (!existingAccount) {
        throw new NotFoundException();
      }

      // Update the existing account with id
      const account = await this.accountModel.findOneAndUpdate(
        { _id: userId.id },
        updateAccountDto,
        { new: true },
      );

      // If account not found
      if (!account) {
        throw new NotFoundException();
      }

      // Account Updation Success
      return {
        success: SUCCESS_RESPONSE.SUCCESS_TRUE,
        statusCode: HttpStatus.OK,
        message: RESPONSE_MESSAGES.ACCOUNT_UPDATE_SUCCESS,
        account,
      };
    } catch (error) {
      // Handle NotFoundException here and return custom message
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: SUCCESS_RESPONSE.SUCCESS_FALSE,
            message: RESPONSE_MESSAGES.ACCOUNT_NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Else Server Error
      throw new InternalServerErrorException();
    }
  }

  // Delete Account
  async deleteAccount(userId) {
    try {
      // Verify if the account with the given id exists
      const existingAccount = await this.accountModel.findOne({
        _id: userId.id,
      });

      // If account doesn't exists
      if (!existingAccount) {
        throw new NotFoundException();
      }

      // Find the expenses created using this account
      const accountsExpenses = await this.expenseModel.find({
        account: existingAccount.id,
      });

      // If account has expenses then delete them
      if (accountsExpenses.length > 0) {
        await this.expenseModel.deleteMany({ account: existingAccount.id });
      }

      // Delete account with id
      await this.accountModel.deleteOne({ _id: userId.id });

      // Account Deleting Success
      return {
        success: SUCCESS_RESPONSE.SUCCESS_TRUE,
        statusCode: HttpStatus.OK,
        message: RESPONSE_MESSAGES.ACCOUNT_DELETE_SUCCESS,
      };
    } catch (error) {
      // Handle NotFoundException here and return custom message
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: SUCCESS_RESPONSE.SUCCESS_FALSE,
            message: RESPONSE_MESSAGES.ACCOUNT_NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Else Server Error
      throw new InternalServerErrorException();
    }
  }
}
