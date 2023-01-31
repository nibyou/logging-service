import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloakModule } from '@nibyou/keycloak';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [KeycloakModule, TerminusModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
