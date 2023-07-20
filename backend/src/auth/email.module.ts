import { Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Module({
  providers: [
    {
      provide: 'MAILER',
      useFactory: () =>
      nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'pravin@infinitysoftsystems.com',
          pass: 'Pr@Vin#5435$',
        },
      }),
    },
  ],
  exports: ['MAILER'], // Export the MAILER provider
})
export class EmailModule {}
