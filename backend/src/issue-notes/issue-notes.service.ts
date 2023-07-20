import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IssueNotes } from './schemas/issue-notes.schemas';
import mongoose from 'mongoose';
import { IssueNotesDto } from 'src/dto/issue-notes.dto';

@Injectable()
export class IssueNotesService {
    constructor(
        @InjectModel(IssueNotes.name)
        private issueNotesModel: mongoose.Model<IssueNotes>
    ){}

    async findAll(): Promise< IssueNotes[] > {
        const issues = await this.issueNotesModel.find();
        return issues;
    }
    async create(issueNotesDto: IssueNotesDto) {
        return new this.issueNotesModel(issueNotesDto).save();
      }
}
