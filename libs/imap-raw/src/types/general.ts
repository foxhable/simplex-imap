export const IMAP_STATUSES = {
  NOT_CONNECTED: 'not_connected',
  CONNECTED: 'connected',
  READY: 'ready',
  DISCONNECTED: 'disconnected',
} as const

export type IMAPStatus = typeof IMAP_STATUSES[keyof typeof IMAP_STATUSES]

export interface TLSOptions {
  readonly ca: string
}

export interface IMAPConfig {
  readonly host: string
  readonly port?: number
  readonly tls?: boolean
  readonly tlsOptions?: TLSOptions
  readonly connectOnCreating?: boolean
  readonly debug?: boolean
}

export type IMAPTag = '*' | string