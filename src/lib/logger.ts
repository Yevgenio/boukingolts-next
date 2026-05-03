type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: 'frontend';
  message: string;
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, extra?: Record<string, unknown>) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    service: 'frontend',
    message,
    ...extra,
  };
  console.log(JSON.stringify(entry));
}

export const logger = {
  info: (message: string, extra?: Record<string, unknown>) => log('info', message, extra),
  warn: (message: string, extra?: Record<string, unknown>) => log('warn', message, extra),
  error: (message: string, extra?: Record<string, unknown>) => log('error', message, extra),
};

export function logApiRequest(
  method: string,
  route: string,
  status: number,
  durationMs: number,
  extra?: Record<string, unknown>
) {
  const level: LogLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
  log(level, 'api request', { method, route, status, duration_ms: durationMs, ...extra });
}
