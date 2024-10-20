import type { MailboxAttribute } from '@/main/classes/Mailbox/types.js'

export interface ParsedMailbox {
  attributes: MailboxAttribute[]
  delimiter: string
  parentsNames: string[]
  name: string
  raw: string
}
