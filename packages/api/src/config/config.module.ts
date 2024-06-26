import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from '~/config/winston-config/winston-config.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule as LoadEnvModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import * as process from 'process';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfigService } from '~/config/mailer.service';

@Global()
@Module({
  imports: [
    /**
     * default cache store is in-memory cache
     * if you want using other cache store, please read docs https://docs.nestjs.com/techniques/caching#different-stores
     * TTL is milliseconds
     */
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 1000,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (optionsProvider: ConfigService) => {
        return new MailConfigService(optionsProvider).createMailOption();
      },
    }),
    LoadEnvModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(
          __dirname,
          '..',
          `../.${process.env.NODE_ENV || 'development'}.env`,
        ),
      ],
    }),
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRES_IN'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class ConfigModule {}
