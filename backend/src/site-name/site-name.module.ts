import { Module } from '@nestjs/common';
import { SiteNameController } from './site-name.controller';
import { SiteNameService } from './site-name.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteNameSchema } from './schemas/site-name.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'SiteName', schema: SiteNameSchema }])],
  controllers: [SiteNameController],
  providers: [SiteNameService]
})
export class SiteNameModule {}
