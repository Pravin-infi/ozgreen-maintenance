import { Body, Controller, Get, Post } from '@nestjs/common';
import { IssueNotesService } from './issue-notes.service';
import { IssueNotes } from './schemas/issue-notes.schemas';
import { IssueNotesDto } from 'src/dto/issue-notes.dto';

@Controller('issue-notes')
export class IssueNotesController {
    constructor(private issueNotesService : IssueNotesService){}

    @Get()
    async getAllIssue(): Promise < IssueNotes[] > {
        return this.issueNotesService.findAll();
    }

    @Post('new')
    async createIssue(@Body() issueNotesDto: IssueNotesDto): Promise < IssueNotes > {
        return this.issueNotesService.create(issueNotesDto);
    }
}
