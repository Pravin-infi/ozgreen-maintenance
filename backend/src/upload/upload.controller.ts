import { UseInterceptors, Controller, Delete, Post, UploadedFiles, Body, UploadedFile, BadRequestException, Param } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Upload } from './schemas/upload.schemas';

@Controller('upload')
export class UploadController {
    constructor(private uploadService : UploadService){}

    @Post()
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
              destination: './assets',
              filename: (req, file, callback) => {
                const uniqueName = uuidv4();
                const fileExtension = path.extname(file.originalname);
                callback(null, `${uniqueName}${fileExtension}`);
              },
            }),
        }),
    )
    async uploadFiles(@Body() bodyData: any, @UploadedFiles() files: Array<Express.Multer.File>) {
      try {
       
        const savedFiles = [];
        for (const file of files) {
          const { originalname, filename, path } = file;
          const savedFile = await this.uploadService.createFileRecord(originalname, filename, path, bodyData.issue_id);
          savedFiles.push(savedFile);
        }
        return savedFiles;
    
      } catch (error) {
        console.error('Error saving image:', error);
        // Handle the error appropriately
      }
    
    }

    @Post('capture')
    @UseInterceptors(FileInterceptor('binaryImage'))
    async uploadImage(@Body() bodyData: any): Promise<Upload> {
      //console.log(bodyData)
      const buffer = bodyData.binaryImage;  
      const uniqueName = uuidv4();
      const fileExtension = '.jpg';
      const filename = `${uniqueName}${fileExtension}`;

      try {
        const savedImagePath = await this.uploadService.saveBase64Image(buffer, filename, bodyData.issue_id);
        console.log('Image saved at:', savedImagePath);
      
        // You can return a response or perform other operations here
      } catch (error) {
        console.error('Error saving image:', error);
        // Handle the error appropriately
      }
      return ;
    }

    @Delete(':id')
    async deleteImage( @Param('id') id: string ): Promise < Upload > {
        return this.uploadService.deleteImageById(id);
    }
    
}
