import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class SiteName extends Document {
  @Prop()
  sitename: string;
}

export const SiteNameSchema = SchemaFactory.createForClass(SiteName);