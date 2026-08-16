export interface LogContext {
  userId?: string;
  projectId?: string;
  organizationId?: string;
  requestId?: string;
  action?: string;
  [key: string]: unknown;
}

export class Logger {
  private static formatEntry(level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string, context?: LogContext, data?: unknown) {
    return JSON.stringify({
      level,
      message,
      context,
      data: data instanceof Error ? { message: data.message, stack: data.stack } : data,
      timestamp: new Date().toISOString(),
    });
  }

  static info(message: string, context?: LogContext, data?: unknown) {
    console.log(this.formatEntry('INFO', message, context, data));
  }

  static warn(message: string, context?: LogContext, data?: unknown) {
    console.warn(this.formatEntry('WARN', message, context, data));
  }

  static error(message: string, context?: LogContext, error?: unknown) {
    console.error(this.formatEntry('ERROR', message, context, error));
  }

  static debug(message: string, context?: LogContext, data?: unknown) {
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG) {
      console.log(this.formatEntry('DEBUG', message, context, data));
    }
  }
}
