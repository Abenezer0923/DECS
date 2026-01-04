type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: any;
}

class Logger {
  private formatLog(level: LogLevel, message: string, meta?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
    };
  }

  private output(entry: LogEntry) {
    const logString = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
    
    if (entry.meta) {
      console.log(logString, entry.meta);
    } else {
      console.log(logString);
    }
  }

  info(message: string, meta?: any) {
    this.output(this.formatLog('info', message, meta));
  }

  warn(message: string, meta?: any) {
    this.output(this.formatLog('warn', message, meta));
  }

  error(message: string, meta?: any) {
    this.output(this.formatLog('error', message, meta));
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.output(this.formatLog('debug', message, meta));
    }
  }
}

export const logger = new Logger();
