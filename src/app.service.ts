import { Injectable } from '@nestjs/common';
import { AuthUser, JsonResponse } from '@nibyou/types';
import { LogDto, User } from './log.dto';
import { sendToLoki } from './loki.helper';

@Injectable()
export class AppService {
  getHealth(): JsonResponse {
    const asTimeString = (uptime: number) => {
      const uptimeInSeconds = uptime % 60;
      let uptimeInMinutes = Math.floor(uptime / 60);
      let uptimeInHours = Math.floor(uptimeInMinutes / 60);
      const uptimeInDays = Math.floor(uptimeInHours / 24);
      uptimeInHours = uptimeInHours % 24;
      uptimeInMinutes = uptimeInMinutes % 60;
      return `${uptimeInDays}d ${uptimeInHours}h ${uptimeInMinutes}m ${uptimeInSeconds.toFixed(
        3,
      )}s`;
    };

    return new JsonResponse()
      .setMessage('healthy')
      .setData({ uptime: asTimeString(process.uptime()) });
  }

  async sendLog(dto: LogDto, user: AuthUser, referer: string) {
    const subject = dto.subject ?? User.fromAuthUser(user);
    const uri = dto.uri ?? referer;

    const values = dto.logLines.map((l) => {
      return ['' + Math.floor(Date.now() * 1000000), l];
    });

    let stream = dto.stream ?? {};

    stream = { ...User.toStreamVars(subject), ...stream };

    stream.uri = uri;
    stream.application = dto.application;
    stream.action = dto.action;
    stream.frontend = '' + !!uri;

    try {
      let { data } = await sendToLoki({
        stream,
        values,
      });

      if (!data) data = { ts: values[0][0] };

      return new JsonResponse().setMessage('Successfully Logged').setData(data);
    } catch (e) {
      console.log(e);
      throw new JsonResponse().setMessage('Not logged').setError(e);
    }
  }
}
