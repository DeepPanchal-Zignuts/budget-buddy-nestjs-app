import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { GetExpenseDTO } from './dto/get-expense.dto';
import { UpdateExpenseDTO } from './dto/update-expense.dto';

@Controller()
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('/add-expense')
  addExpense(@Body() createExpenseDto: CreateExpenseDTO) {
    return this.expenseService.addExpense(createExpenseDto);
  }

  @Post('/get-expense')
  getAllExpense(@Body() getExpenseDto: GetExpenseDTO) {
    return this.expenseService.getAllExpense(getExpenseDto);
  }

  @Patch('/update-expense/:id')
  editExpense(
    @Body() updateExpenseDto: UpdateExpenseDTO,
    @Param() userId: string,
  ) {
    return this.expenseService.editExpense(updateExpenseDto, userId);
  }

  @Delete('/delete-expense/:id')
  deleteExpense(@Param() userId: string) {
    return this.expenseService.deleteExpense(userId);
  }
}
