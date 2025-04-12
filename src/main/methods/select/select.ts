import type { SelectMethodConfig, SelectParse } from './types.js'
import { IMAP_STATUSES, type IMAPResponseLine } from '@/base/types/index.js'
import type { SimplexIMAP } from '@/main.js'
import { SimplexIMAPError } from '@/main/general/error.js'
import type { MailboxFlag } from '@/main/classes/Mailbox/types.js'
import { MAILBOX_FLAGS } from '@/main/classes/Mailbox/types.js'
import { SelectedMailbox } from '@/main/classes/Mailbox/SelectedMailbox.js'

export async function select<TConfig extends SelectMethodConfig>(
  this: SimplexIMAP,
  mailbox: string,
  config?: TConfig,
): Promise<
  TConfig extends {
    onlyParse: infer ParseOption
  }
    ? ParseOption extends true
      ? SelectParse
      : SelectedMailbox
    : SelectedMailbox
> {
  await this._waitStatus(IMAP_STATUSES.READY)

  const res = await this.send(config?.readonly ? 'EXAMINE' : 'SELECT', { mailbox })

  if (!res.ok) {
    this.selectedMailbox = null
    throw new SimplexIMAPError(res.body, { res })
  }

  const parse = parseSelect(res.response.lines)
  const selectedMailbox = new SelectedMailbox(this, { name: mailbox, mailbox: config?.mailbox })

  this.selectedMailbox = selectedMailbox

  // @ts-expect-error TS2322 fix later
  return config?.onlyParse ? parse : selectedMailbox
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

function parseSelect(lines: IMAPResponseLine[]): SelectParse {
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
    { messageCounts: {} } as SelectParse,
  )
}
