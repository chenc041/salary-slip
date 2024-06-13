import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailConfigService {
  constructor(private readonly configService: ConfigService) {
  }

  createMailOption(): MailerOptions {
    console.log(this.configService.get('MAIL_PORT'), 'this.configService')
    return {
      transport: {
        host: this.configService.get('MAIL_HOST'),
        port: Number(this.configService.get('MAIL_PORT')),
        secure: true,
        auth: {
          user: this.configService.get('MAIL_USER_NAME'),
          pass: this.configService.get('MAIL_PASS_WORD'),
        },
      },
      defaults: {
        from: this.configService.get('MAIL_FROM'),
      },
      template: {
        dir: join(__dirname, '..', `../templates`),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
