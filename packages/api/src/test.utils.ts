import { join } from 'path';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { WinstonModule } from 'nest-winston';
import { ConfigModule as LoadEnvModule } from '@nestjs/config';
import { WinstonConfigService } from '~/config/winston-config/winston-config.service';
import { JwtConfigService } from '~/config/jwt-config/jwt-config.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import * as process from 'process';

export const TypeOrmTestingModule = ({
  controllers,
  providers,
  entities,
}: {
  controllers: any[];
  providers: any[];
  entities: any[];
}) => {
  return {
    imports: [
      HttpModule,
      CacheModule.register({
        isGlobal: true,
      }),
      JwtModule.register({
        global: true,
      }),
      LoadEnvModule.forRoot({
        isGlobal: true,
        envFilePath: [
          join(__dirname, `../.${process.env.NODE_ENV || 'development'}.env`),
        ],
      }),
      WinstonModule.forRootAsync({
        useClass: WinstonConfigService,
      }),
    ],
    controllers: controllers,
    providers: [
      JwtConfigService,
      WinstonConfigService,
      JwtService,
      ...providers,
    ],
  };
};
