import { config } from 'dotenv';
config({ quiet: true });
config({ path: '.env.test', quiet: true });

import { json, nest } from './formats';
import { createLogger, logger } from './index';
import { console } from './transports';

logger.error('error!');
logger.error('error! again', new Error('error! again,,,,,,,'));
logger.error('error! again again', {
  err: new Error('error! again'),
  val: { c: 43 },
});
logger.error({ error: new Error('error') });
logger.error({ err: new Error('error') });
logger.error({ lol: new Error('error'), val: { c: 43 } });
logger.error(new Error('error!!!'));
logger.debug({
  a: {
    b: [{ c: 1 }, { d: 2 }, { e: { f: 2, g: true, ee: 'dssdsdsdds' } }],
  },
});
logger.info({
  a: {
    b: [{ c: 1 }, { d: 2 }, { e: { f: 2, g: true, ee: 'dssdsdsdds' } }],
  },
});
logger.warn('warning!', {
  a: {
    b: [{ c: 1 }, { d: 2 }, { e: { f: 2, g: true, ee: 'dssdsdsdds' } }],
  },
});

logger.error(
  new Error('this is a', {
    cause: new Error('nested error, and this', {
      cause: new Error('line should read straight'),
    }),
  })
);

const nestlogger = createLogger({ transports: [console({ format: nest() })] });
nestlogger.info('MyService', 'hey!');
nestlogger.info('MyService', { ho: 2 });
nestlogger.info('MyService', { ho: 2 }, { ha: 233 });
nestlogger.info('MyService', 'lalalalal', { ho: 2 }, { ha: 233 });
nestlogger.info('MyService', 'lalalalal', [{ ho: 2 }, { ha: 233 }]);
nestlogger.destroy();

const jsonlogger = createLogger({ transports: [console({ format: json() })] });
jsonlogger.info('MyService', 'dsdsds!');
jsonlogger.info('MyService', { ho: 2 });
jsonlogger.info('MyService', { ho: 2 }, { ha: 233 });
jsonlogger.info('MyService', 'ezfefz', { ho: 2 }, { ha: 233 });
jsonlogger.info('MyService', 'fezefe', [{ ho: 2 }, { ha: 233 }]);
jsonlogger.destroy();
