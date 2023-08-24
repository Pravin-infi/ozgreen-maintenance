import { Module } from '@nestjs/common';
import { IssueNotesController } from './issue-notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueNotesSchema } from './schemas/issue-notes.schemas';
import { IssueNotesService } from './issue-notes.service';
import { EmailModule } from 'src/auth/email.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'IssueNotes', schema: IssueNotesSchema }]),EmailModule],
  controllers: [IssueNotesController],
  providers: [IssueNotesService]
})
export class IssueNotesModule {}
