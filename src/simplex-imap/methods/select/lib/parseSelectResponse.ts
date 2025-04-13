import type { IMAPResponseLine } from '@/low-level-imap/types/index.js'
import type { MailboxFlag, MailboxMessageCounts } from '@/simplex-imap/entities/mailbox/types.js'
import { MAILBOX_FLAGS } from '@/simplex-imap/entities/mailbox/index.js'

export interface SelectResponse {
  messageCounts: MailboxMessageCounts
  flags: MailboxFlag[]
  permanentFlags: MailboxFlag[] | null
  uid: number
  uidNext: number
}

const FLAGS_LIST = Object.values(MAILBOX_FLAGS)
  .map((i) => `\\${i}`)
  .join('|')
const FLAGS_REGEX = new RegExp(`FLAGS \\(((?:(?:${FLAGS_LIST}) ?)+)\\)`)
const PERMANENT_FLAGS_REGEX = new RegExp(`OK \\[PERMANENTFLAGS \\(((?:(?:${FLAGS_LIST}) ?)+)\\)]`)
const EXISTS_REGEX = /(\d+) EXISTS/
const RECENT_REGEX = /(\d+) RECENT/
const UNSEEN_REGEX = /OK \[UNSEEN (\d+)]/
const UID_REGEX = /OK \[UIDVALIDITY (\d+)]/
const NEXT_UID_REGEX = /OK \[UIDNEXT (\d+)]/

export function parseSelectResponse(lines: IMAPResponseLine[]): SelectResponse {
  return lines.reduce(
    (result, item) => {
      switch (true) {
        case PERMANENT_FLAGS_REGEX.test(item.body): {
          const match = item.body.match(PERMANENT_FLAGS_REGEX)
          result.permanentFlags = match![1].split(' ') as MailboxFlag[]
          break
        }
        case FLAGS_REGEX.test(item.body): {
          const match = item.body.match(FLAGS_REGEX)
          result.flags = match![1].split(' ') as MailboxFlag[]
          break
        }
        case EXISTS_REGEX.test(item.body): {
          const match = item.body.match(EXISTS_REGEX)
          result.messageCounts.exists = Number(match![1])
          break
        }
        case RECENT_REGEX.test(item.body): {
          const match = item.body.match(RECENT_REGEX)
          result.messageCounts.recent = Number(match![1])
          break
        }
        case UNSEEN_REGEX.test(item.body): {
          const match = item.body.match(UNSEEN_REGEX)
          result.messageCounts.unseen = Number(match![1])
          break
        }
        case UID_REGEX.test(item.body): {
          const match = item.body.match(UID_REGEX)
          result.uid = Number(match![1])
          break
        }
        case NEXT_UID_REGEX.test(item.body): {
          const match = item.body.match(NEXT_UID_REGEX)
          result.uidNext = Number(match![1])
          break
        }

        case !PERMANENT_FLAGS_REGEX.test(item.body): {
          result.permanentFlags = null
          break
        }
      }

      return result
    },
    { messageCounts: {} } as SelectResponse,
  )
}
