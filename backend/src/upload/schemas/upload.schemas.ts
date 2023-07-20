import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({
    timestamps: true
})
export class Upload {
    @Prop()
    fileName: string

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Issue' })
    issue_id: Types.ObjectId;   

    @Prop()
    user_id: string
}

export const uploadSchema = SchemaFactory.createForClass(Upload)