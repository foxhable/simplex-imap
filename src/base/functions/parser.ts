import type { IMAPResponseLine, IMAPResult, IMAPTag, ResponseCode, ResponseStatus } from '@/base/types/index.js'
import { RESPONSE_CODES, RESPONSE_STATUSES } from '@/base/types/index.js'
import { RawIMAPError } from '@/base/general/error.js'

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
export const IMAP_RESULT_REGEX = new RegExp(`(?:\r\n)?${TAG_REGEX_PART} ${STATUS_REGEX_PART} ${CODE_REGEX_PART}${BODY_REGEX_PART}\r\n$`)
export const IMAP_RESPONSE_LINE_REGEX = new RegExp(`(?<${GROUP_NAMES.TAG}>[*+]) (?<${GROUP_NAMES.BODY}>.+)`)

export function parseIMAPResponse(data: string): IMAPResult {
  const match = data.match(IMAP_RESULT_REGEX)

  if (!match) {
    throw new RawIMAPError('Data doesnt match to regex pattern', { data })
  }

  const response = data.replace(match[0], '')
  const responseLines = response
    .split('\r\n')
    .filter(Boolean)
    .map(line => [ line, line.match(IMAP_RESPONSE_LINE_REGEX) ])
    .map<IMAPResponseLine>(([ line, lineMatch ]) => {
      if (!lineMatch) {
        throw new RawIMAPError('Response line doesnt match to regex pattern',
          {
            line,
            response,
          },
        )
      }

      return {
        tag: lineMatch[1] as IMAPTag,
        body: lineMatch[2],
        raw: lineMatch[0],
      }
    })

  if (!match.groups) {
    throw new RawIMAPError('')
  }

  const status = match.groups[GROUP_NAMES.STATUS] as ResponseStatus

  const result = {
    tag: match.groups[GROUP_NAMES.TAG],
    code: match.groups[GROUP_NAMES.CODE] as ResponseCode || null,
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