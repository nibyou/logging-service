import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser, JsonResponse, RealmRoles } from '@nibyou/types';
import { AuthenticatedUser, Public, Roles } from 'nest-keycloak-connect';
import { LogDto } from './log.dto';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@Controller()
@ApiBearerAuth()
@ApiTags('Logging')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  @Public()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'loki-online',
          `${process.env.LOKI_BASE_URL}/ready`,
          {
            auth: {
              username: process.env.LOKI_BASIC_AUTH_USER,
              password: process.env.LOKI_BASIC_AUTH_PASS,
            },
          },
        ),
      () =>
        this.http.responseCheck(
          'loki-ready',
          `${process.env.LOKI_BASE_URL}/ready`,
          (res) => {
            return res.data.toString().trim() === 'ready';
          },
          {
            auth: {
              username: process.env.LOKI_BASIC_AUTH_USER,
              password: process.env.LOKI_BASIC_AUTH_PASS,
            },
          },
        ),
    ]);
  }

  @Post('log')
  @ApiCreatedResponse({
    description: 'Log has been sent to Loki',
    type: JsonResponse,
  })
  @Roles({
    roles: [
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
      RealmRoles.USER_PATIENT,
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PRACTITIONER_PENDING,
    ],
  })
  log(
    @Body() dto: LogDto,
    @AuthenticatedUser() user: AuthUser,
    @Headers('Referer') referer?: string,
  ) {
    return this.appService.sendLog(dto, user, referer);
  }
}
