import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({
    timestamps: true
})
export class IssueNotes {
    @Prop()
    notes: string       

    @Prop({type: SchemaTypes.ObjectId, ref:  'User'})
    user_id: Types.ObjectId

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Issue' })
    issue_id: Types.ObjectId;
}

export const IssueNotesSchema = SchemaFactory.createForClass(IssueNotes)