import type { MailboxFlag, MailboxMessageCounts } from '../../types/index.js'

export interface SelectMethodConfig {
  /** @description if true - using EXAMINE instead SELECT */
  readonly: boolean
  onlyParse?: boolean
}

export interface SelectParse {
  messageCounts: MailboxMessageCounts
  flags: MailboxFlag[]
  permanentFlags: MailboxFlag[] | null
  uid: number
  uidNext: number
}