export const IMAP_CONN_STATUSES = {
  NOT_CONNECTED: 'not_connected',
  CONNECTED: 'connected',
  READY: 'ready',
  DISCONNECTED: 'disconnected',
} as const

export type IMAPConnStatus = (typeof IMAP_CONN_STATUSES)[keyof typeof IMAP_CONN_STATUSES]
