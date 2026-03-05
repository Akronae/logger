import { json } from '@/src/formats';
import { transports } from 'winston';

export function file() {
  const app = process.env.APP_NAME?.replace(/(\/|\\| )/g, '-') ?? 'app';
  const dir = process.env.LOG_DIR;

  if (!dir) {
    return null;
  }

  return new transports.File({
    filename: `${dir}/${app}.log`.replaceAll('//', '/'),
    format: json(),
  });
}
