export const IMAP_STATUSES = {
  NOT_CONNECTED: 'not_connected',
  CONNECTED: 'connected',
  READY: 'ready',
  DISCONNECTED: 'disconnected',
} as const

export type IMAPStatus = (typeof IMAP_STATUSES)[keyof typeof IMAP_STATUSES]
