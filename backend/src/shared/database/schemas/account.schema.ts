import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User, UserModel } from './user.schema';

@Schema({
  timestamps: true,
})
export class Account {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  balance: number;

  @Prop({ type: Types.ObjectId, ref: UserModel, required: true })
  owner: Types.ObjectId | User;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

export type AccountDocument = Account & Document;

export const AccountModel = Account.name;
