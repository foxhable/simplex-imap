export const MAILBOX_ATTRIBUTES = {
  INBOX: '\\Inbox',
  SPAM: '\\Spam',
  SENT: '\\Sent',
  DRAFTS: '\\Drafts',
  TRASH: '\\Trash',
  NON_EXISTENT: '\\NonExistent',
  ALL: '\\All',
  ARCHIVE: '\\Archive',
  FLAGGED: '\\Flagged',
  HAS_CHILDREN: '\\HasChildren',
  HAS_NO_CHILDREN: '\\HasNoChildren',
  IMPORTANT: '\\Important',
  JUNK: '\\Junk',
  MARKED: '\\Marked',
  NO_INFERIORS: '\\NoInferiors',
  NOSELECT: '\\Noselect',
  REMOTE: '\\Remote',
  SUBSCRIBED: '\\Subscribed',
  UNMARKED: '\\Unmarked',
} as const

export type MailboxAttribute = (typeof MAILBOX_ATTRIBUTES)[keyof typeof MAILBOX_ATTRIBUTES]
