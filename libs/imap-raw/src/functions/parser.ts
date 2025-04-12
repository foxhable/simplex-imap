import type { IMAPResponseLine, IMAPResult, IMAPTag, ResponseCode, ResponseStatus } from '../types/index.js'
import { RESPONSE_CODES, RESPONSE_STATUSES } from '../types/index.js'
import { RawIMAPError } from '../general/error.js'

const TAG_REGEX_PART = '([\\d*]+)'
const STATUS_REGEX_PART = `(${Object.values(RESPONSE_STATUSES).join('|')})`
const CODE_REGEX_PART = `(?:\\[(${Object.values(RESPONSE_CODES).join('|')})] )?`
const BODY_REGEX_PART = '(.*)'
export const IMAP_RESULT_REGEX = new RegExp(`(?:\r\n)?${TAG_REGEX_PART} ${STATUS_REGEX_PART} ${CODE_REGEX_PART}${BODY_REGEX_PART}\r\n$`)
export const IMAP_RESPONSE_LINE_REGEX = new RegExp(`([*+]) (.+)`)

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

  return {
    tag: match[1],
    status: match[2] as ResponseStatus,
    ok: (match[2] as ResponseStatus) === 'OK',
    code: match[3] as ResponseCode || null,
    raw: match[0].replaceAll('\r\n', ''),
    body: match[4],
    response: {
      lines: responseLines,
      raw: response,
    },
  }
}