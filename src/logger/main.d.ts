type LoggerFn = (text: string, ...info: any[]) => void

export type LogLevel = 'none' | 'err' | 'warn' | 'info' | 'all'
export const LOG_LEVELS: {
  [Key in `${Uppercase<LogLevel>}`]: `${Lowercase<Key>}`
}

interface Logger {
  log: LoggerFn
  err: LoggerFn
  warn: LoggerFn
  logLevel: LogLevel
  setLogLevel: (newLevel: LogLevel) => void
}

interface LoggerConfig {
  prefix: string
  initLogLevel?: LogLevel
}

export function createLogger(config: LoggerConfig): Logger

export const imapRawLogger: Logger
export const tenImapLogger: Logger
