import { Body, Controller, Get, Headers, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser, JsonResponse, RealmRoles } from '@nibyou/types';
import { AuthenticatedUser, Public, Roles } from 'nest-keycloak-connect';
import { LogDto } from './log.dto';

@Controller()
@ApiBearerAuth()
@ApiTags('Logging')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOkResponse({
    status: 200,
    description: 'API health check',
    type: JsonResponse,
  })
  @HttpCode(200)
  @Public()
  getHealth(): JsonResponse {
    return this.appService.getHealth();
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
