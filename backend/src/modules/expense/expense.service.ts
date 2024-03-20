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
  PAGINATION,
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

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(ExpenseModel)
    private readonly expenseModel: Model<ExpenseDocument>,
    @InjectModel(AccountModel)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  async addExpense(createExpenseDto) {
    try {
      // Create a new expense
      const newExpense = await this.expenseModel.create(createExpenseDto);

      // Find the account to update
      const accountToUpdate = await this.accountModel.findOne({
        _id: createExpenseDto.account,
      });

      // If Account Not Found
      if (!accountToUpdate) {
        throw new NotFoundException();
      }

      // Update the account balance according to the entered 'type'
      if (createExpenseDto.type === 'Expense') {
        accountToUpdate.balance -= createExpenseDto.amount;
      } else if (createExpenseDto.type === 'Income') {
        accountToUpdate.balance += createExpenseDto.amount;
      }

      // Keep the account balance updated
      const afterUpdateAccount = await this.accountModel.findOneAndUpdate(
        {
          _id: accountToUpdate.id,
        },
        { balance: accountToUpdate.balance },
        { new: true },
      );

      // Expense Created Success
      return {
        success: SUCCESS_RESPONSE.SUCCESS_TRUE,
        statusCode: HttpStatus.CREATED,
        message: RESPONSE_MESSAGES.EXPENSE_ADDED_SUCCESS,
        newExpense,
        afterUpdateAccount,
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
      // Server Error
      throw new InternalServerErrorException();
    }
  }
  async getAllExpense(getExpenseDto) {
    try {
      // Destructure from the DTO
      const { account, frequency, selectedDate, type } = getExpenseDto;

      // For Pagingation
      const page = getExpenseDto.page || 1;
      const perPage = PAGINATION.PAGE_SIZE;
      const skip = (page - 1) * perPage;

      // Create a Query about what to find from the database
      const criteria: { account: any; type: any; date?: any } = {
        // Only include type if it is not "all"
        ...(type !== 'all' && { type }),
        account,
      };

      // If frequency is "custom", filter expenses based on selected date range
      if (frequency === 'custom' && selectedDate && selectedDate.length === 2) {
        criteria.date = {
          $gte: new Date(selectedDate[0]),
          $lte: new Date(selectedDate[1]),
        };
      }

      // Find expenses based on destructured attributes
      const expenses = await this.expenseModel
        .find(criteria)
        .skip(skip)
        .limit(perPage);

      // If expenses not found
      if (!expenses || expenses.length === 0) {
        throw new NotFoundException();
      }

      // Expenses Fetched Successfully
      return {
        success: SUCCESS_RESPONSE.SUCCESS_TRUE,
        statusCode: HttpStatus.OK,
        message: RESPONSE_MESSAGES.EXPENSE_FETCHED_SUCCESS,
        expenses,
      };
    } catch (error) {
      // Handle NotFoundException here and return custom message
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: SUCCESS_RESPONSE.SUCCESS_FALSE,
            message: RESPONSE_MESSAGES.NO_EXPENSE_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Server Error
      throw new InternalServerErrorException();
    }
  }
  async editExpense(updateExpenseDto, userId) {
    try {
      // Expense Before Updation
      const oldExpense = await this.expenseModel.findOne({ _id: userId.id });

      // If Old Expense not found
      if (!oldExpense) {
        throw new NotFoundException(RESPONSE_MESSAGES.NO_EXPENSE_FOUND);
      }

      // Updating the expense with new values
      const updatedExpense = await this.expenseModel.findOneAndUpdate(
        { _id: userId.id },
        { ...updateExpenseDto },
        { new: true },
      );

      // Calculate the difference of amount
      const amountDifference = updatedExpense.amount - oldExpense.amount;

      // Find the account to update
      const accountToUpdate = await this.accountModel.findOne({
        _id: updatedExpense.account,
      });

      // If Account Not Found
      if (!accountToUpdate) {
        throw new NotFoundException(RESPONSE_MESSAGES.NO_ACCOUNTS_FOUND);
      }

      // Update the account balance according to the entered 'type'
      if (updatedExpense.type === 'Expense') {
        accountToUpdate.balance -= amountDifference;
      } else if (updatedExpense.type === 'Income') {
        accountToUpdate.balance += amountDifference;
      }

      // Keep the account balance updated
      const afterUpdateAccount = await this.accountModel.findOneAndUpdate(
        { _id: accountToUpdate.id },
        { balance: accountToUpdate.balance },
        { new: true },
      );

      // Updated Expense successfully
      return {
        success: SUCCESS_RESPONSE.SUCCESS_TRUE,
        statusCode: HttpStatus.OK,
        message: RESPONSE_MESSAGES.EXPENSE_UPDATING_SUCCESS,
        updatedExpense,
        afterUpdateAccount,
      };
    } catch (error) {
      // Handle NotFoundException here and return custom message
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: SUCCESS_RESPONSE.SUCCESS_FALSE,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Server Error
      throw new InternalServerErrorException();
    }
  }
  async deleteExpense(userId) {
    try {
      // Verify if the expense with the given id exists
      const existingExpense = await this.expenseModel.findOne({
        _id: userId.id,
      });

      // If Expense Not Found
      if (!existingExpense) {
        throw new NotFoundException();
      }

      // Find the account to update
      const accountToUpdate = await this.accountModel.findOne({
        _id: existingExpense.account,
      });

      // Update the account balance according to the entered 'type'
      if (existingExpense.type === 'Expense') {
        accountToUpdate.balance += existingExpense.amount;
      } else if (existingExpense.type === 'Income') {
        accountToUpdate.balance -= existingExpense.amount;
      }

      // Keep the account balance updated
      const afterUpdateAccount = await this.accountModel.findOneAndUpdate(
        { _id: accountToUpdate.id },
        { balance: accountToUpdate.balance },
        { new: true },
      );

      // Delete the expense by Id
      await this.expenseModel.deleteOne({ _id: userId.id });

      // Expense Deleted Successfully
      return {
        success: SUCCESS_RESPONSE.SUCCESS_TRUE,
        statusCode: HttpStatus.OK,
        message: RESPONSE_MESSAGES.EXPENSE_DELETE_SUCCESS,
        afterUpdateAccount,
      };
    } catch (error) {
      // Handle NotFoundException here and return custom message
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: SUCCESS_RESPONSE.SUCCESS_FALSE,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Server Error
      throw new InternalServerErrorException();
    }
  }
}
