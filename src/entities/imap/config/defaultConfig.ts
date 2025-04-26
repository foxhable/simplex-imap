import { LOG_LEVELS } from '@/shared/logger/index.js'
import type { LogLevel } from '@/shared/logger/logger.js'
import type { ConnectionOptions } from 'node:tls'

export type TLSOptions = Pick<ConnectionOptions, 'cert' | 'key' | 'ca' | 'servername' | 'checkServerIdentity'>

export interface IMAPCredentials {
  username: string
  password: string
}

export interface IMAPConfig {
  readonly host: string
  /** @description if [`tls`]{@link tls} is `true` then default `993`, otherwise `143` */
  readonly port?: number
  /**
   * @description if `true` then use tls for connect, otherwise using tcp.
   *
   * Also affecting on default value of [`tls`]{@link tls}
   * @default true
   * */
  readonly tls?: boolean
  readonly tlsOptions?: TLSOptions
  readonly logLevel?: LogLevel
  readonly credentials?: IMAPCredentials
}

export const defaultConfig = {
  tls: true,
  logLevel: LOG_LEVELS.NONE,
} as const satisfies Partial<IMAPConfig>

export interface SimplexIMAPConfig extends IMAPConfig {
  /**
   * @description if `true` then calling [`connect`]{@link IMAP.connect} when creating instance
   * @default true
   * */
  readonly connectOnCreating?: boolean
  /**
   * @description if `true` then calling [`login`]{@link IMAP.login} with [`credentials`]{@link credentials} after connect.
   *
   * If [`connectOnCreating`]{@link connectOnCreating} is `false` then not affect.
   * @default true
   * */
  readonly loginOnCreating?: boolean
}

export const defaultSimplexIMAPConfig = {
  connectOnCreating: true,
  loginOnCreating: true,
} as const satisfies Partial<SimplexIMAPConfig>
