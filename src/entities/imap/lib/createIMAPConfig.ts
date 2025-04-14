import type { LogLevel } from '@/shared/logger/types.js'
import type { IMAP } from '../class/IMAP.js'

export interface TLSOptions {
  readonly ca: string
}

export interface IMAPCredentials {
  username: string
  password: string
}

export type IMAPConfig = {
  readonly host: string
  readonly port?: number
  readonly tls?: boolean
  readonly tlsOptions?: TLSOptions
  readonly connectOnCreating?: boolean
  readonly logLevel?: LogLevel
  readonly credentials?: IMAPCredentials
}

export function createIMAPConfig(this: IMAP, userConfig?: IMAPConfig) {
  return Object.assign(this._defaultConfig, userConfig)
}
