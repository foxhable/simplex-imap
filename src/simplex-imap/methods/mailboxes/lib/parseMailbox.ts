import { IMAPError } from '@/logger/main.js'
import { MAILBOX_ATTRIBUTES, type MailboxAttribute } from '@/simplex-imap/classes/Mailbox/types.js'

export interface ParsedMailbox {
  attributes: MailboxAttribute[]
  delimiter: string
  parentsNames: string[]
  name: string
  raw: string
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
    throw new IMAPError('LIST response text doesnt match to regex pattern', { text })
  }

  if (!match.groups) {
    throw new IMAPError('Cannot parse groups. Its unexpected, please create Issue')
  }

  const delimiter = match.groups[GROUPS.DELIMITER]
  const path = match.groups[GROUPS.MAILBOX].split(delimiter)
  const name = path.at(-1)

  if (!name) {
    throw new IMAPError('Cannot parse name of mailbox. Its unexpected, please create Issue')
  }

  return {
    attributes: <MailboxAttribute[]>match.groups[GROUPS.ATTRIBUTES].split(' ').filter(Boolean),
    delimiter,
    parentsNames: path.slice(0, -1),
    name,
    raw: text,
  }
}
