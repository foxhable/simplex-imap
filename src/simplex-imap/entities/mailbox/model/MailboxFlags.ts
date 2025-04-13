export const MAILBOX_FLAGS = {
  ANSWERED: '\\Answered',
  FLAGGED: '\\Flagged',
  DELETED: '\\Deleted',
  DRAFT: '\\Draft',
  SEEN: '\\Seen',
} as const

export type MailboxFlag = (typeof MAILBOX_FLAGS)[keyof typeof MAILBOX_FLAGS]
