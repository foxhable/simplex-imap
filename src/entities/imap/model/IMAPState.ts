export const IMAP_STATES = {
  NOT_AUTH: 'not-authenticated',
  AUTH: 'authenticated',
  SELECTED: 'selected',
  LOGOUT: 'logout',
} as const

export type IMAPState = (typeof IMAP_STATES)[keyof typeof IMAP_STATES]
