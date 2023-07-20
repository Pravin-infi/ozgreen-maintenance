import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Issue } from './schemas/issue.schemas';
import { IssueDto } from '../dto/issue.dto';
import { ObjectId } from 'bson';
import { Upload } from 'src/upload/schemas/upload.schemas';
import { IssueNotes } from 'src/issue-notes/schemas/issue-notes.schemas';

@Injectable()
export class IssueService {
    constructor(
    @InjectModel(Issue.name) private readonly issueModel: mongoose.Model<Issue>,
    @InjectModel(Upload.name) private uploadModel: mongoose.Model<Upload>,
    @InjectModel(IssueNotes.name) private issueNotesModel: mongoose.Model<IssueNotes>

    ){}

    async findAll(): Promise< Issue[] > {

        return this.issueModel.aggregate(
            [{
                $lookup: {
                    from: 'issuenotes', 
                    localField: '_id',
                    foreignField: 'issue_id',
                    as: 'issuenotes',
                },
            },
        ]).sort({ _id: 'desc'}).exec();
    }

    async create(issueDto: IssueDto) {
      return new this.issueModel(issueDto).save();
    }

    async findById(issueId: string): Promise<Issue []> {
    try {
        const issueObjectId = new ObjectId(issueId);
        const result = await this.issueModel.aggregate([
            {
                $match: { _id: issueObjectId }
            },
            {
              $lookup: {
                from: "issuenotes",
                localField: "_id",
                foreignField: "issue_id",
                as: "issuenotes"
              }
            },
            {
                $lookup: {
                  from: "uploads",
                  localField: "_id",
                  foreignField: "issue_id",
                  as: "uploads"
                }
            },
          ]).exec();
          console.log(result);

      return result;
    } catch (error) {
      // Handle the error
      console.error(error);
      return null;
    }
  }

  async deleteIssueById(id: string): Promise<Issue> {
    const result = await this.issueModel.findByIdAndDelete(id);
    await this.issueNotesModel.deleteMany({ issue_id: id });
    await this.uploadModel.deleteMany({ issue_id: id });
    return result;
  }
}
