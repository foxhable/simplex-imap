export const MAILBOX_ROLES = {
  ALL: 'all',
  INBOX: 'inbox',
  ARCHIVE: 'archive',
  DRAFTS: 'drafts',
  FLAGGED: 'flagged',
  JUNK: 'junk',
  SENT: 'sent',
  TRASH: 'trash',
}

export type MailboxRole = (typeof MAILBOX_ROLES)[keyof typeof MAILBOX_ROLES]
