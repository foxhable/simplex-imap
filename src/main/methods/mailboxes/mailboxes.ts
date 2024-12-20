import type { SimplexIMAP } from '@/main.js'
import type { ParsedMailbox } from './types.js'
import { SimplexIMAPError } from '@/main/general/error.js'
import { Mailbox } from '@/main/classes/Mailbox/Mailbox.js'
import type { MailboxAttribute } from '@/main/classes/Mailbox/types.js'
import { MAILBOX_ATTRIBUTES } from '@/main/classes/Mailbox/types.js'
import { RawIMAPError } from '@/base/general/error.js'

export async function mailboxes(this: SimplexIMAP) {
  const res = await this.send('LIST', {
    refName: '""',
    mailbox: '"*"',
  })

  if (!res.ok) throw new SimplexIMAPError(res.body, { res })

  return res.response.lines.map((line) => {
    const parsed = parseMailbox(line.body)
    return new Mailbox(this, parsed)
  })
}

const GROUPS = {
  ATTRIBUTES: 'attributes',
  DELIMITER: 'delimiter',
  MAILBOX: 'mailbox',
}

const MAILBOX_ATTRIBUTES_LIST_REGEX_PART = Object.values(MAILBOX_ATTRIBUTES)
  .map((i) => `\\${i}`)
  .join('|')
const MAILBOX_ATTRIBUTES_REGEX_PART = `\\((?<${GROUPS.ATTRIBUTES}>(?:(?:${MAILBOX_ATTRIBUTES_LIST_REGEX_PART}) ?)*)\\)`
const DELIMITER_REGEX_PART = `(?:"(?<${GROUPS.DELIMITER}>.+)"|NIL)`
const MAILBOX_NAME_REGEX_PART = `"(?<${GROUPS.MAILBOX}>.+)"`
const MAILBOX_PARSE_REGEX = new RegExp(
  `LIST ${MAILBOX_ATTRIBUTES_REGEX_PART} ${DELIMITER_REGEX_PART} ${MAILBOX_NAME_REGEX_PART}`,
)

export function parseMailbox(text: string): ParsedMailbox {
  const match = text.match(MAILBOX_PARSE_REGEX)

  if (!match) {
    throw new SimplexIMAPError('LIST response text doesnt match to regex pattern', { text })
  }

  if (!match.groups) {
    throw new SimplexIMAPError('Cannot parse groups. Its unexpected, please create Issue')
  }

  const delimiter = match.groups[GROUPS.DELIMITER]
  const path = match.groups[GROUPS.MAILBOX].split(delimiter)
  const name = path.at(-1)

  if (!name) {
    throw new RawIMAPError('Cannot parse name of mailbox. Its unexpected, please create Issue')
  }

  return {
    attributes: <MailboxAttribute[]>match.groups[GROUPS.ATTRIBUTES].split(' ').filter(Boolean),
    delimiter,
    parentsNames: path.slice(0, -1),
    name,
    raw: text,
  }
}
