interface LoggerConfig {
  prefix: string
  initLogLevel?: LogLevel
}

export const LOG_LEVELS = {
  NONE: 'none',
  ERR: 'err',
  WARN: 'warn',
  INFO: 'info',
  ALL: 'all',
}

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS]

function isLogLevelOneOf(logLevel: LogLevel, list: LogLevel[]) {
  return list.map((i) => logLevel.includes(i)).includes(true)
}

export function createLogger(config: LoggerConfig) {
  const addPrefix = (text: string) => (config.prefix ? `[${config.prefix}] ${text}` : text)

  return {
    logLevel: config.initLogLevel || LOG_LEVELS.NONE,
    setLogLevel(newLevel: LogLevel) {
      this.logLevel = newLevel
    },
    err(text: string, ...info: any[]) {
      if (!isLogLevelOneOf(this.logLevel, [LOG_LEVELS.ALL, LOG_LEVELS.ERR])) return

      console.error(addPrefix(text), ...info)
    },
    log(text: string, ...info: any[]) {
      if (!isLogLevelOneOf(this.logLevel, [LOG_LEVELS.ALL, LOG_LEVELS.INFO])) return

      console.log(addPrefix(text), ...info)
    },
    warn(text: string, ...info: any[]) {
      if (!isLogLevelOneOf(this.logLevel, [LOG_LEVELS.ALL, LOG_LEVELS.WARN])) return

      console.warn(addPrefix(text), ...info)
    },
  }
}

export const imapRawLogger = createLogger({ prefix: 'imap-raw' })
export const tenImapLogger = createLogger({ prefix: 'ten-imap' })
