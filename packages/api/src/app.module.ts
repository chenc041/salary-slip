import { Module } from '@nestjs/common';
import { ConfigModule } from '~/config/config.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: '/root/work/server/client',
    }),
  ],
})
export class AppModule {}
