import { IMAPError } from '@/shared/logger/index.js'

import type { MessageFlag } from '@/entities/message/types.js'
import { type FetchBodyParseResult, parseBody } from './lib/parseBody.js'
import { type EnvelopeParsed, parseEnvelope } from './lib/parseEnvelope.js'
import { parseFlags } from './lib/parseFlags.js'
import { type MessageHeadersParsed, parseHeaders } from './lib/parseHeaders.js'
import { parseInternalDate } from './lib/parseInternalDate.js'
import { parseSize } from './lib/parseSize.js'
import { parseUID } from './lib/parseUID.js'

function unfoldMessage(raw: string): string {
  return raw.replaceAll(/\r\n[ \t]/g, ' ').replaceAll(/ {8}/g, ' ')
}

export interface FetchParseResult {
  uid: null | number
  flags: Array<MessageFlag | string>
  size: number | null
  internalDate: Date | null
  headers: MessageHeadersParsed
  body: FetchBodyParseResult
  envelope: EnvelopeParsed
  raw: string
}

const FETCH_RESPONSE_REGEX = /\d+ FETCH \((?<raw>[\W\w]*)+\)/

// TODO: Add parsing of BODYSTRUCTURE
export function fetchResponseParser(rawResponse: string): FetchParseResult {
  const unfoldedRaw = unfoldMessage(rawResponse)

  const responseMatch = unfoldedRaw.match(FETCH_RESPONSE_REGEX)
  if (!responseMatch?.groups) {
    throw new IMAPError('Unexpected error while parsing fetch')
  }

  const raw = responseMatch.groups.raw

  return {
    raw,
    body: parseBody(raw),
    envelope: parseEnvelope(raw),
    flags: parseFlags(raw),
    headers: parseHeaders(raw),
    internalDate: parseInternalDate(raw),
    size: parseSize(raw),
    uid: parseUID(raw),
  }
}
