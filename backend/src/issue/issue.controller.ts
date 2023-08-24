import { Body, Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { IssueService } from './issue.service';
import { Issue } from './schemas/issue.schemas';
import { IssueDto } from '../dto/issue.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('issue')
export class IssueController {
    constructor(private issueService : IssueService){}

    @Get()
    @UseGuards(AuthGuard())
    async getAllIssue(): Promise < Issue[] > {
        return this.issueService.findAll();
    }

    @Post('new')
    async createIssue(
        @Body() 
        issueDto: IssueDto,
        ): Promise < Issue > {
        return this.issueService.create(issueDto);
    }

    @Get(':id')
    async getIssue( @Param('id') id: string ): Promise < Issue []> {
        return this.issueService.findById(id);
    }

    @Delete(':id')
    async deleteIssue( @Param('id') id: string ): Promise < Issue > {
        return this.issueService.deleteIssueById(id);
    }

    @Post('sendIssueMail')
    async getIssueMail(@Body() requestBody: any): Promise<Issue[]> {        
        return this.issueService.findAndMail(requestBody);
    }
}
