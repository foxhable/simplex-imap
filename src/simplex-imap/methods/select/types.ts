import type { Mailbox } from '@/simplex-imap/classes/Mailbox/Mailbox.js'
import type { MailboxFlag, MailboxMessageCounts } from '@/simplex-imap/classes/Mailbox/types.js'

export interface SelectMethodConfig {
  /** @description if true - using EXAMINE instead SELECT */
  readonly: boolean
  onlyParse?: boolean
  mailbox?: Mailbox
}

export interface SelectParse {
  messageCounts: MailboxMessageCounts
  flags: MailboxFlag[]
  permanentFlags: MailboxFlag[] | null
  uid: number
  uidNext: number
}
