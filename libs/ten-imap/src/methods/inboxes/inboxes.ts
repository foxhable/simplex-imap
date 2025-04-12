import TenIMAP from '../../main.js'
import { MAILBOX_ATTRIBUTES } from './types.js'
import type { MailboxAttribute, ParsedMailbox } from './types.js'

export async function inboxes(this: TenIMAP) {
  const res = await this.send('LIST', { refName: '""', mailbox: '"*"' })

  if (!res.ok) throw new Error('[ten-imap] Error while getting inbox list')

  const list = res.response.lines.map(line => parseMailbox(line.body))
  return list
}

const MAILBOX_ATTRIBUTES_LIST_REGEX_PART = Object.values(MAILBOX_ATTRIBUTES).map(i => `\\${i}`).join('|')
const MAILBOX_ATTRIBUTES_REGEX_PART = `\\(((?:(?:${MAILBOX_ATTRIBUTES_LIST_REGEX_PART}) ?)*)\\)`
const DELIMITER_REGEX_PART = '(?:"(.+)"|NIL)'
const MAILBOX_NAME_REGEX_PART = '"(.+)"'
const MAILBOX_PARSE_REGEX = new RegExp(`LIST ${MAILBOX_ATTRIBUTES_REGEX_PART} ${DELIMITER_REGEX_PART} ${MAILBOX_NAME_REGEX_PART}`)

function parseMailbox(text: string): ParsedMailbox {
  const match = text.match(MAILBOX_PARSE_REGEX)

  if (!match) {
    console.error('[ten-imap] LIST response text doesnt match to regex pattern. Text:\n', text)
    throw new Error('[ten-imap] Error while parsing LIST response item')
  }

  return {
    attributes: <MailboxAttribute[]>match[1].split(' ').filter(Boolean),
    delimiter: match[2],
    name: match[3],
    raw: text,
  }
}
