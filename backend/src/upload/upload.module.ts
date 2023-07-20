import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { uploadSchema } from './schemas/upload.schemas';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [MongooseModule.forFeature([{ name: 'Upload', schema: uploadSchema }])]
  
})
export class UploadModule {}
