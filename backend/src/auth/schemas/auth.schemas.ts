import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})
export class User extends Document {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop({ default: null })
    verifycode: string;

    @Prop({ default: false })
    status: boolean;

    @Prop({ default: 'user' })
    usertype: string;

    @Prop({ unique: [true, "Username entered"] })
    username: string;

    @Prop()
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
