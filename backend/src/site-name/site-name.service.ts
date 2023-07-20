import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SiteName } from './schemas/site-name.schemas';
import mongoose from 'mongoose';
import { SiteNameDto } from 'src/dto/site-name.dto';

@Injectable()
export class SiteNameService {
    constructor(
        @InjectModel(SiteName.name)
        private siteNameModel: mongoose.Model<SiteName>
    ){}

    async create(siteNameDto: SiteNameDto) {
        return new this.siteNameModel(siteNameDto).save();
    }

    async findAll(): Promise< SiteName[] > {
        const res = await this.siteNameModel.find();
        return res;
    }
}
