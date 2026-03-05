import { inspect } from 'util';
import { format } from 'winston';

export function nest() {
  const colorizer = format.colorize({
    all: true,
    colors: {
      label: 'grey',
      file: 'grey',
      info: 'white',
      error: 'red',
      warn: 'yellow',
      orange: 'green',
    },
  });

  return format.combine(
    format.timestamp({
      format: 'HH:mm:ss:SSS',
    }),
    format.printf((info) => {
      const splat = info[Symbol.for('splat')] as any[];
      const splatData: any[] | undefined = splat?.slice(1);
      const msg: any | undefined = splat?.[0] ?? info.message;
      const splatPretty = splatData?.length
        ? splatData.length == 1
          ? inspect(splatData[0], { colors: true, depth: 5 })
          : inspect(splatData, { colors: true, depth: 5 })
        : null;

      const label = colorizer.colorize(
        'label',
        `${info.timestamp}` +
          ` [${colorizer.colorize(info.level, info.level.toUpperCase())}]:`
      );

      const message = colorizer.colorize(
        info.level,
        typeof msg === 'object'
          ? inspect(msg, { colors: true, depth: 5 })
          : colorizer.colorize(info.level, msg)
      );

      const service =
        info.message != msg
          ? colorizer.colorize('orange', info.message as string)
          : null;

      return [label, service, message, splatPretty]
        .filter(Boolean)
        .join(' ')
        .trim();
    })
  );
}
