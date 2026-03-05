import { isDate } from 'util/types';
import { format } from 'winston';

function replacer<T>(_key: string, value: T) {
  if (value instanceof Buffer) {
    return value.toString('base64');
  } else if (value instanceof Error) {
    const simple = Object.getOwnPropertyNames(value).reduce(
      (acc, key) => {
        acc[key] = value[key as keyof T];
        return acc;
      },
      {} as Record<string, unknown>
    );
    if (value.cause) {
      simple.cause = replacer('cause', value.cause);
    }
    return simple;
  }

  return value;
}

export function json() {
  // return format.json({ replacer });
  return format.combine(
    format.printf((info) => {
      const splat = info[Symbol.for('splat')] as any[];
      let { message } = info;
      const { level } = info;
      const rest = {};
      for (const s of splat ?? []) {
        if (
          typeof s == 'boolean' ||
          typeof s == 'string' ||
          typeof s == 'number' ||
          isDate(s)
        ) {
          message += ' ' + s.toLocaleString();
        } else {
          Object.assign(rest, s);
        }
      }

      return JSON.stringify({ level, message, ...rest }, replacer);
    })
  );
}
