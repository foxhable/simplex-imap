import type { MailboxAttribute } from '../../classes/Mailbox/types.js'

export interface ParsedMailbox {
  attributes: MailboxAttribute[]
  delimiter: string
  name: string
  raw: string
}
