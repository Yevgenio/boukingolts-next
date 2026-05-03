import client from 'prom-client';

declare global {
  // eslint-disable-next-line no-var
  var __metricsRegistry: client.Registry | undefined;
}

function createRegistry(): client.Registry {
  const register = new client.Registry();
  client.collectDefaultMetrics({ register, prefix: 'frontend_' });

  new client.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests to Next.js API routes',
    labelNames: ['method', 'route', 'status'],
    registers: [register],
  });

  new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds for Next.js API routes',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    registers: [register],
  });

  new client.Counter({
    name: 'http_errors_total',
    help: 'Total HTTP errors (4xx/5xx) in Next.js API routes',
    labelNames: ['method', 'route', 'status'],
    registers: [register],
  });

  return register;
}

// Reuse registry across hot-reloads in dev
if (!global.__metricsRegistry) {
  global.__metricsRegistry = createRegistry();
}

export const register = global.__metricsRegistry;

export function getCounter(name: string): client.Counter<string> {
  return register.getSingleMetric(name) as client.Counter<string>;
}

export function getHistogram(name: string): client.Histogram<string> {
  return register.getSingleMetric(name) as client.Histogram<string>;
}
