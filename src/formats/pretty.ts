import { inspect } from 'util';
import { format } from 'winston';

function getLoggerCallee() {
  const obj: { stack?: string } = {};
  Error.stackTraceLimit = 1000;
  Error.captureStackTrace(obj);
  const split = obj.stack?.split('\n');
  const firstLoggerCall = split?.findLastIndex((line) =>
    line.includes('at DerivedLogger')
  );
  const callee = split?.at((firstLoggerCall ?? -2) + 1);
  let file = callee
    ?.match(/\((.*)\)/)?.[1]
    .replace(process.cwd() + '/', '')
    .replace('file://', '');

  if (file?.includes('node_modules')) {
    file = file.match(/node_modules\/(.*)\/dist/)?.[1] ?? file;
  }

  return file ?? '<unknown file>';
}

export function pretty() {
  const colorizer = format.colorize({
    all: true,
    colors: {
      label: 'grey',
      file: 'grey',
      info: 'white',
      error: 'red',
      warn: 'yellow',
    },
  });

  return format.combine(
    format.timestamp({
      format: 'HH:mm:ss:SSS',
    }),
    format.printf((info) => {
      let splatData = info[Symbol.for('splat')];
      if (Array.isArray(splatData) && splatData.length === 1 && info.message) {
        splatData = splatData[0];
      }
      const splat = splatData && inspect(splatData, { colors: true, depth: 5 });

      const label = colorizer.colorize(
        'label',
        `${info.timestamp}` +
          ` [${colorizer.colorize(info.level, info.level.toUpperCase())}]:`
      );

      const file = colorizer.colorize('file', getLoggerCallee());

      const message = colorizer.colorize(
        info.level,
        typeof info.message === 'object'
          ? inspect(info.message, { colors: true, depth: 5 })
          : colorizer.colorize(info.level, info.message as string)
      );

      return [label, file, message, splat].filter(Boolean).join(' ').trim();
    })
  );
}
