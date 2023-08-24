import { Module } from '@nestjs/common';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueSchema } from './schemas/issue.schemas';
import { AuthModule } from '../auth/auth.module';
import { IssueNotesSchema } from  '../issue-notes/schemas/issue-notes.schemas'//'src/issue-notes/schemas/issue-notes.schemas';
import { uploadSchema } from '../upload/schemas/upload.schemas';
import { EmailModule } from 'src/auth/email.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Issue', schema: IssueSchema },
      { name: 'IssueNotes', schema: IssueNotesSchema },
      { name: 'Upload', schema: uploadSchema },
    ]),
    EmailModule
  ],
  controllers: [IssueController],
  providers: [IssueService]
})
export class IssueModule {}
