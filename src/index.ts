import * as formats from '@/src/formats';
import * as transports from '@/src/transports';
import { filterFalsy } from '@/src/utils';
import { readFileSync } from 'fs';
import {
  Logger,
  LoggerOptions,
  createLogger as winstonCreateLogger,
} from 'winston';

export * as formats from '@/src/formats';
export * as transports from '@/src/transports';

export { Logger } from 'winston';

export function createLogger(options?: LoggerOptions) {
  const isDev =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  const level = (process.env.LOG_LEVEL as string) ?? 'info';
  const format = process.env.LOG_FORMAT ?? (isDev ? 'pretty' : 'json');

  if (!process.env.APP_NAME) {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
    const project = (pkg.name as string)?.replace(/@.*\//, '');
    process.env.APP_NAME = project;
  }

  const levels = ['debug', 'info', 'warn', 'error'];
  if (!levels.includes(level)) {
    throw new Error(`Invalid log level: '${level}'`);
  }
  console.log(
    `[${process.env.APP_NAME}] log level set to '${level}'. Ignoring:`,
    levels.slice(0, levels.indexOf(level))
  );

  return winstonCreateLogger({
    level,
    transports: filterFalsy([
      !isDev && transports.loki(),
      transports.console({
        format: formats[format as keyof typeof formats]?.() ?? formats.json(),
      }),
    ]),
    ...options,
  });
}

export type AirLogger = Logger & {
  throw: (
    msg: Error | string | Record<string | number | symbol, unknown> | string,
    args?: Record<string | number | symbol, unknown>
  ) => Error;
  error: (
    msg: Error | string | Record<string | number | symbol, unknown> | string,
    args?: Record<string | number | symbol, unknown>
  ) => void;
};

let instance: AirLogger | null = null;

export function reloadLogger() {
  instance = createLogger() as AirLogger;
  return instance;
}

const proxy = new Proxy<AirLogger>({} as AirLogger, {
  get(_target, prop) {
    if (!instance) {
      instance = reloadLogger();
    }

    if (prop === 'error') {
      return (...args: Parameters<Logger['error']>) => {
        if (args.length == 1 && args[0] instanceof Error) {
          return instance!.error({ error: args[0] });
        } else {
          return instance!.error(...args);
        }
      };
    }

    if (prop === 'throw') {
      return (
        msg:
          | Error
          | string
          | Record<string | number | symbol, unknown>
          | string,
        args?: Record<string | number | symbol, unknown>
      ) => {
        if (typeof msg === 'string') {
          msg = new Error(msg);
        }
        if (msg instanceof Error) {
          msg = { error: msg };
        }
        if (args) {
          msg = { ...msg, ...args };
        }

        instance!.error(msg);

        return (
          msg.error ??
          (Object.values(msg).find((v) => v instanceof Error) as Error)
        );
      };
    }

    return instance[prop as keyof AirLogger];
  },
});

export const logger = proxy;
