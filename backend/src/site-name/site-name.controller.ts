import { Body, Controller, Get, Post } from '@nestjs/common';
import { SiteNameService } from './site-name.service';
import { SiteNameDto } from 'src/dto/site-name.dto';
import { SiteName } from './schemas/site-name.schemas';

@Controller('site-name')
export class SiteNameController {
    constructor(private siteNameService : SiteNameService){}

    @Get()
    async getAllIssue(): Promise < SiteName[] > {
        return this.siteNameService.findAll();
    }

    @Post('new')
    async createIssue(@Body() siteNameDto: SiteNameDto): Promise < SiteName > {
        return this.siteNameService.create(siteNameDto);
    }
}
