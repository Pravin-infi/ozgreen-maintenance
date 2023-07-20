import { Module } from '@nestjs/common';
import { IssueNotesController } from './issue-notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueNotesSchema } from './schemas/issue-notes.schemas';
import { IssueNotesService } from './issue-notes.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'IssueNotes', schema: IssueNotesSchema }])],
  controllers: [IssueNotesController],
  providers: [IssueNotesService]
})
export class IssueNotesModule {}
