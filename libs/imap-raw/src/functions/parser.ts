import {
  IMAPResponseLine,
  IMAPResult,
  IMAPTag,
  RESPONSE_CODES,
  RESPONSE_STATUSES,
  ResponseCode,
  ResponseStatus
} from "../types/index.js";

const TAG_REGEX_PART = '([\\d*]+)'
const STATUS_REGEX_PART = `(${Object.values(RESPONSE_STATUSES).join('|')})`
const CODE_REGEX_PART = `(?:\\[(${Object.values(RESPONSE_CODES).join('|')})] )?`
const BODY_REGEX_PART = '(.*)'
export const IMAP_RESULT_REGEX = new RegExp(`(?:\r\n)?${TAG_REGEX_PART} ${STATUS_REGEX_PART} ${CODE_REGEX_PART}${BODY_REGEX_PART}\r\n$`)
export const IMAP_RESPONSE_LINE_REGEX = new RegExp(`([*+]) (.+)`)

export function parseIMAPResponse(data: string): IMAPResult {
  const match = data.match(IMAP_RESULT_REGEX)

  if (!match) {
    console.error('Data doesnt match to regex pattern. Data:\n', data)
    throw new Error('Error while parsing')
  }

  const response = data.replace(match[0], '')
  const responseLines = response
    .split('\r\n')
    .filter(Boolean)
    .map(line => [line, line.match(IMAP_RESPONSE_LINE_REGEX)])
    .map<IMAPResponseLine>(([line, lineMatch]) => {
      if (!lineMatch) {
        console.error('Response line doesnt match to regex pattern. Line:\n', line, '\nResponse:\n', response)
        throw new Error('Error while parsing')
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
    code: match[3] as ResponseCode || null,
    raw: match[0].replaceAll('\r\n', ''),
    body: match[4],
    response: {
      lines: responseLines,
      raw: response
    }
  }
}