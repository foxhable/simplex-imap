import type { IMAPResponseLine, IMAPResult, ResponseCode, ResponseStatus } from '@/low-level-imap/types/index.js'
import { RESPONSE_CODES, RESPONSE_STATUSES } from '@/low-level-imap/types/index.js'
import { IMAPError } from '@/logger/main.js'

const GROUP_NAMES = {
  TAG: 'tag',
  STATUS: 'status',
  CODE: 'code',
  BODY: 'body',
}

const TAG_REGEX_PART = `(?<${GROUP_NAMES.TAG}>[\\d*]+)`
const STATUS_REGEX_PART = `(?<${GROUP_NAMES.STATUS}>${Object.values(RESPONSE_STATUSES).join('|')})`
const CODE_REGEX_PART = `(?:\\[(?<${GROUP_NAMES.CODE}>${Object.values(RESPONSE_CODES).join('|')})] )?`
const BODY_REGEX_PART = `(?<${GROUP_NAMES.BODY}>.*)`
export const IMAP_RESULT_REGEX = new RegExp(
  `(?:\r\n)?${TAG_REGEX_PART} ${STATUS_REGEX_PART} ${CODE_REGEX_PART}${BODY_REGEX_PART}\r\n$`,
)
export const IMAP_RESPONSE_LINE_REGEX = new RegExp(
  `^(?<${GROUP_NAMES.TAG}>[*+]) (?<${GROUP_NAMES.BODY}>(?:[\\w\\W](?!^\\*))+)`,
  'gm',
)

export function hasResultLine(data: string) {
  return IMAP_RESULT_REGEX.test(data)
}

export function parseIMAPResponse(data: string): IMAPResult {
  const match = data.match(IMAP_RESULT_REGEX)

  if (!match) {
    throw new IMAPError('Data doesnt have result response line', { data })
  }

  const response = data.replace(match[0], '')

  const responseLines: IMAPResponseLine[] = [...response.matchAll(IMAP_RESPONSE_LINE_REGEX)].map((match) => {
    if (!match.groups) {
      throw new IMAPError('')
    }

    return {
      tag: match.groups[GROUP_NAMES.TAG],
      body: match.groups[GROUP_NAMES.BODY].trim(),
      raw: match[0],
    }
  })

  // TODO: add text
  if (!match.groups) {
    throw new IMAPError('')
  }

  const status = match.groups[GROUP_NAMES.STATUS] as ResponseStatus

  const result = {
    tag: match.groups[GROUP_NAMES.TAG],
    code: (match.groups[GROUP_NAMES.CODE] as ResponseCode) || null,
    raw: match[0].replaceAll('\r\n', ''),
    body: match.groups[GROUP_NAMES.BODY],
    response: {
      lines: responseLines,
      raw: response,
    },
  }

  // if statement because type error
  if (status === 'NO' || status === 'BAD') {
    return {
      ok: false,
      status,
      ...result,
    }
  } else {
    return {
      ok: true,
      status,
      ...result,
    }
  }
}
