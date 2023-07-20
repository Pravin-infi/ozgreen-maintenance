import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueModule } from './issue/issue.module';
import { IssueNotesModule } from './issue-notes/issue-notes.module';
import { UploadModule } from './upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { SiteNameModule } from './site-name/site-name.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(
      'mongodb://54.253.133.85/GCW_Maintenance',
    ),
    IssueModule,
    IssueNotesModule,
    UploadModule,
    MulterModule.register({
      dest : "./assets"
    }),
    SiteNameModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
