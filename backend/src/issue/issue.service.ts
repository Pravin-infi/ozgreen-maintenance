import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Issue } from './schemas/issue.schemas';
import { IssueDto } from '../dto/issue.dto';
import { ObjectId } from 'bson';
import { Upload } from 'src/upload/schemas/upload.schemas';
import { IssueNotes } from 'src/issue-notes/schemas/issue-notes.schemas';
import { Transporter } from 'nodemailer';

@Injectable()
export class IssueService {
    constructor(
    @Inject('MAILER') private readonly mailer: Transporter,
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

  async findAndMail(req): Promise< Issue[] > {
    try {
        const issueObjectId = new ObjectId(req.issueId);        
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


      var to  = 'test12@yopmail.com';
        var subject = result[0].site_name;

        const htmlContent = `
            <p>Hi Team,</p>
            <p>${result[0].issuenotes[(result[0].issuenotes.length)-1].notes}</p>
            <p>Thanks,</p>
            <p>Reporting team</p>`;

        const attachments = result[0].uploads.map(item => {
          return {
            ...item,
            path: 'assets/'+item.fileName,
          };
        });

        const mailOptions = {
            from: 'pravin@infinitysoftsystems.com',
            to,
            subject,
            html: htmlContent,
            attachments
          };
          
        return await this.mailer.sendMail(mailOptions);

    } catch (error) {
      // Handle the error
      console.error(error);
      return null;
    }
  }
}
