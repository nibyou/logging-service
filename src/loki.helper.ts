import axios from 'axios';
import 'dotenv/config';

export class LokiLog {
  stream: Record<string, string>;
  values: Array<Array<string>>;
}

export async function sendToLoki(log: LokiLog) {
  const data = {
    streams: [
      {
        ...log,
      },
    ],
  };
  return axios.post(`${process.env.LOKI_BASE_URL}/loki/api/v1/push`, data, {
    auth: {
      username: process.env.LOKI_BASIC_AUTH_USER,
      password: process.env.LOKI_BASIC_AUTH_PASS,
    },
  });
}
