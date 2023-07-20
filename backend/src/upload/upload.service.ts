import { Injectable } from '@nestjs/common';
import { Upload } from './schemas/upload.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    constructor(
        @InjectModel(Upload.name)
        private uploadModel: mongoose.Model<Upload>
    ){}

    async createFileRecord(originalName: string, fileName: string, filePath: string, issue_id: string): Promise <Upload> {
        const newFile = this.uploadModel.create({
          originalName,
          fileName,
          filePath,
          issue_id
        });
        return newFile;
    }
    saveBase64Image(base64Image: string, fileName: string, issue_id): Promise<string> {
        return new Promise((resolve, reject) => {
          const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');
          const imagePath = path.join(__dirname, '..', '../assets', fileName);
    
          fs.writeFile(imagePath, base64Data, 'base64', (error) => {
            if (error) {
              reject(error);
            } else {
                const newFile = this.uploadModel.create({
                    fileName,
                    issue_id
                  });
                  //return newFile;
              resolve(imagePath);
            }
          });
        });
      }

      async deleteImageById(id: string): Promise<Upload> {
        const result = await this.uploadModel.findByIdAndDelete(id);
        return result;
      }
}
