import type TenIMAP from '@/main/main.js'
import type { ParsedMailbox } from './types.js'
import { TenIMAPError } from '@/main/general/error.js'
import { Mailbox } from '@/main/classes/Mailbox/Mailbox.js'
import type { MailboxAttribute } from '@/main/classes/Mailbox/types.js'
import { MAILBOX_ATTRIBUTES } from '@/main/classes/Mailbox/types.js'

export async function mailboxes(this: TenIMAP) {
  const res = await this.send(
    'LIST',
    {
      refName: '""',
      mailbox: '"*"',
    },
  )

  if (!res.ok) throw new TenIMAPError(res.body, { res })

  const list = res.response.lines.map(line => parseMailbox(line.body))
  return list.map(data => new Mailbox(this, data))
}

const MAILBOX_ATTRIBUTES_LIST_REGEX_PART = Object.values(MAILBOX_ATTRIBUTES).map(i => `\\${i}`).join('|')
const MAILBOX_ATTRIBUTES_REGEX_PART = `\\(((?:(?:${MAILBOX_ATTRIBUTES_LIST_REGEX_PART}) ?)*)\\)`
const DELIMITER_REGEX_PART = '(?:"(.+)"|NIL)'
const MAILBOX_NAME_REGEX_PART = '"(.+)"'
const MAILBOX_PARSE_REGEX = new RegExp(`LIST ${MAILBOX_ATTRIBUTES_REGEX_PART} ${DELIMITER_REGEX_PART} ${MAILBOX_NAME_REGEX_PART}`)

function parseMailbox(text: string): ParsedMailbox {
  const match = text.match(MAILBOX_PARSE_REGEX)

  if (!match) {
    throw new TenIMAPError('LIST response text doesnt match to regex pattern', { text })
  }

  return {
    attributes: <MailboxAttribute[]>match[1].split(' ').filter(Boolean),
    delimiter: match[2],
    name: match[3],
    raw: text,
  }
}