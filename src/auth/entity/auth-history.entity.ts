import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthHistoryDocument = AuthHistory & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class AuthHistory {
  @Prop()
  login: string;
}

export const AuthHistorySchema = SchemaFactory.createForClass(AuthHistory);
