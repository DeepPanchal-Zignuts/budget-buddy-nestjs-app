import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Account, AccountModel } from './account.schema';

@Schema({
  timestamps: true,
})
export class Expense {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  reference?: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: AccountModel, required: true })
  account: Types.ObjectId | Account;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

export type ExpenseDocument = Expense & Document;

export const ExpenseModel = Expense.name;
