import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ResetToken extends Document {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);