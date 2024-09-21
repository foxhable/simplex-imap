export const LOG_LEVELS = {
  NONE: 'none',
  ERR: 'err',
  WARN: 'warn',
  INFO: 'info',
  ALL: 'all',
}

/**
 * @param {LogLevel} logLevel
 * @param {LogLevel[]} list
 * */
function isLogLevelOneOf(logLevel, list) {
  return list.map(i => logLevel.includes(i)).includes(true)
}

export function createLogger(config) {
  /**
   * @param {string} text
   * @return {string}
   * */
  const addPrefix = (text) => config.prefix ? `[${config.prefix}] ${text}` : text

  /** @type {Logger}  */
  const logger = {
    logLevel: config.initLogLevel || LOG_LEVELS.NONE,
    setLogLevel(newLevel) {
      this.logLevel = newLevel
    },
    err(text, ...info) {
      if (!isLogLevelOneOf(this.logLevel, [LOG_LEVELS.ALL, LOG_LEVELS.ERR])) return

      console.error(addPrefix(text), ...info)
    },
    log(text, ...info) {
      if (!isLogLevelOneOf(this.logLevel, [LOG_LEVELS.ALL, LOG_LEVELS.INFO])) return

      console.log(addPrefix(text), ...info)
    },
    warn(text, ...info) {
      if (!isLogLevelOneOf(this.logLevel, [LOG_LEVELS.ALL, LOG_LEVELS.WARN])) return

      console.warn(addPrefix(text), ...info)
    }
  }

  return logger
}

export const imapRawLogger = createLogger({ prefix: 'imap-raw' })
export const tenImapLogger = createLogger({ prefix: 'ten-imap' })