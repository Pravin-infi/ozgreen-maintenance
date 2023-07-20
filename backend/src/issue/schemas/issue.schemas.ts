import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({
    timestamps: true
})
export class Issue {
    _id: string;

    @Prop()
    site_name: string;

    @Prop()
    timestamp: string;

    @Prop()
    postedByName: string;

    @Prop({type: SchemaTypes.ObjectId, ref:  'User'})
    user_id: Types.ObjectId;

    issuenotes: string;

}

export const IssueSchema = SchemaFactory.createForClass(Issue)