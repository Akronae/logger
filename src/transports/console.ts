import { transports } from 'winston';
import { pretty } from '@/src/formats';

export function console(args: { format?: ReturnType<typeof pretty> } = {}) {
  return new transports.Console({
    format: args.format ?? pretty(),
  });
}
