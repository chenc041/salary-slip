import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '~/user/user.service';
import { JwtConfigService } from '~/config/jwt-config/jwt-config.service';
import { LoginDto } from '~/dtos/login.dto';
import {
  comparePassword,
  generatePassword,
  HttpResponse,
  HttpResponseType,
} from '~/utils';
import { omit } from 'lodash';
import { GetUser } from '~/decorators/user.decorator';
import { JwtAuthGuard } from '~/config/jwt-config/jwtAuth.guard';
import { AUTH_COOKIES_KEY } from '~/constants';
import { HttpService } from '@nestjs/axios';
import { map, Observable } from 'rxjs';
import { Cache } from 'cache-manager';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { error, Logger } from 'winston';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { UserType } from '~/base.type';
import { FastifyReply } from 'fastify';
import { ApiTags } from '@nestjs/swagger';
import { MailerService } from '@nestjs-modules/mailer';

const username = 'admin';
const password = 'admin'

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    private readonly jwt: JwtConfigService,
    private readonly httpService: HttpService,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('login')
  async login(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<HttpResponseType<{ token: string }>> {

    let userInfo = undefined;
    if (user.password === password && user.username === username) {
      userInfo = user;
    }
    if (userInfo) {
      const { username, id } = userInfo;
      const { token } = await this.jwt.signToken({ username, userId: 1 });
      response.setCookie(AUTH_COOKIES_KEY, token, {
        httpOnly: true,
      });
      return new HttpResponse({
        data: {
          token,
        },
      });
    }
    return new HttpResponse({
      statusCode: 10001,
    });
  }

  @Get('currentUser')
  async currentUser(@GetUser() user: UserType) {
    return new HttpResponse({
      data: omit(user, 'password'),
    });
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) response: FastifyReply) {
    response.setCookie(AUTH_COOKIES_KEY, '', {
      expires: new Date(0),
    });
    return new HttpResponse({
      statusCode: 10000,
    });
  }

  @Get('cache')
  async cache() {
    await this.cacheManager.set('test', 'chen');
    const cacheValue = await this.cacheManager.get<string>('test');
    return new HttpResponse({
      data: {
        cacheValue,
      },
    });
  }

  @Post('notify')
  async notify(@Body() excel: any) {
    const result: any[] = [];
    for (const excelElement of excel) {
      this.mailerService
      .sendMail({
        to: excelElement['邮箱'], // list of receivers
        subject: excelElement['姓名'] +  ' - 工资条', // Subject line
        template: 'index',
        context: excelElement
      })
      .catch((r) => {
        result.push(excelElement)
      });
    }
    return new HttpResponse({
      data: result,
    });
  }

  @Get('log')
  log() {
    this.logger.warn('this is warn level');
    this.logger.debug('this is debug level');
    this.logger.info('this is info level');
    this.logger.error('this is error level');
    return 'log';
  }

  @UseInterceptors(CacheInterceptor) // auto cache
  @Get('http')
  http(): Observable<Record<any, any>> {
    return this.httpService
      .get('https://api.github.com/users/chenc041')
      .pipe(map((val) => val.data));
  }
}
