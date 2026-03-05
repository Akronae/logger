import { json } from '@/src/formats';
import { hostname } from 'os';
import LokiTransport from 'winston-loki';

export function loki({ labels } = { labels: {} }) {
  const grafana = {
    host: process.env.GRAFANA_HOST,
    user: process.env.GRAFANA_USER,
    pass: process.env.GRAFANA_PASS,
  };

  if (!grafana.host || !grafana.user || !grafana.pass) {
    return null;
  }

  const app = process.env.APP_NAME;
  if (!app) {
    throw new Error(
      '`APP_NAME` is required when forwarding logs to Grafana Loki'
    );
  }

  return new LokiTransport({
    host: grafana.host,
    labels: {
      ...(labels ?? {}),
      app,
      host: hostname(),
      gh_action: process.env.GITHUB_ACTION,
      gh_job: process.env.GITHUB_JOB,
      gh_actor: process.env.GITHUB_ACTOR,
    },
    json: true,
    basicAuth: `${grafana.user}:${grafana.pass}`,
    replaceTimestamp: true,
    onConnectionError: (err) => console.error(err),
    timeout: 10,
    format: json(),
    // not using batching as it creates an async handle
    // that prevents the process from exiting
    // not good for Lambda
    batching: false,
  });
}
