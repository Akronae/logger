# Getting started

```bash
yarn add @akronae/logger
```

If you set `GRAFANA_*`, logs will be sent to Grafana when `NODE_ENV != development`.  
To write logs to a file, set `LOG_DIR`.

```ts
import { logger } from '@akronae/logger';

logger.info('crunched scrapper results', {
  client: 'acme',
  txCount: 122,
});

logger.error('uppps crash!', { error: new Error('ups') });

// not shown if you did not set
// LOG_LEVEL=debug
logger.debug({
  rnd: Math.random(),
  a: { b: 1, c: 'heyehey', d: [1, 2, { val: 'foo' }] },
});

logger.end();
```

# How does it work

This packages provides a configured Winstonjs logger.  
In development mode, it outputs prettified logs, with file lines and colored JSON.  
In production mode, all this expensive stuff is removed, it only outputs a basic JSON format with Buffer/Error handling.
