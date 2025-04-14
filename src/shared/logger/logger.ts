export class IMAPError extends Error {
  public data: any[]

  constructor(message: string, ...data: any[]) {
    super(message)
    this.name = 'IMAPError'
    this.data = data
  }
}

interface LoggerConfig {
  prefix: string
  initLogLevel?: LogLevel
}

export const LOG_LEVELS = {
  NONE: 'none',
  WARN: 'warn',
  INFO: 'info',
  ALL: 'all',
}

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS]

function isLogLevelOneOf(logLevel: LogLevel, list: LogLevel[]) {
  return list.map((i) => logLevel.includes(i)).includes(true)
}

function createLogger(config: LoggerConfig) {
  const addPrefix = (text: string) => (config.prefix ? `[${config.prefix}] ${text}` : text)

  return {
    logLevel: config.initLogLevel || LOG_LEVELS.NONE,
    setLogLevel(newLevel: LogLevel) {
      this.logLevel = newLevel
    },
    log(text: string, data?: object) {
      if (!isLogLevelOneOf(this.logLevel, [LOG_LEVELS.ALL, LOG_LEVELS.INFO])) return

      console.log(addPrefix(text), data)
    },
    warn(text: string, data?: object) {
      if (!isLogLevelOneOf(this.logLevel, [LOG_LEVELS.ALL, LOG_LEVELS.WARN])) return

      console.warn(addPrefix(text), data)
    },
  }
}

export const imapRawLogger = createLogger({ prefix: 'imap:low-level' })
export const simplexImapLogger = createLogger({ prefix: 'imap' })
