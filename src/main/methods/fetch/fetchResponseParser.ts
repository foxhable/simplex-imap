import type { EnvelopeParsed, FetchParseResult, MessageHeadersParsed } from '@/main/methods/fetch/types.js'
import { SimplexIMAPError } from '@/main/general/error.js'
import { parseAddressFromEnvelope, parseAddressFromHeaders } from '@/main/methods/fetch/addressParser.js'
import { parseContentType } from '@/main/methods/fetch/contentTypeParser.js'

const FETCH_RESPONSE_REGEX = /\d+ FETCH \((?<raw>[\W\w]*)+\)/
const UID_REGEX = /UID (?<uid>\d+)/
const SIZE_REGEX = /RFC822.SIZE (?<size>\d+)/
const INTERNALDATE_REGEX = /INTERNALDATE "(?<internalDate>\d{2}-\w{3}-\d{4} (\d\d:?){3} \+\d{4})"/
const FLAGS_REGEX = /FLAGS \((?<flags>(?:[\w\\$]+ ?)*)\)/
const BODY_HEADER_REGEX = /BODY\[HEADER] \{\d+}\r\n(?<headers>[\W\w]*)\r\n/
const ENVELOPE_REGEX =
  /ENVELOPE \((?:"(?<date>.*)"|NIL|"") (?:"(?<subject>.*)"|""|NIL) (?:\((?<from>.+)\)|NIL) (?:\((?<sender>.+)\)|NIL) (?:\((?<replyTo>.+)\)|NIL) (?:\((?<to>.+)\)|NIL) (?:\((?<cc>.+)\)|NIL) (?:\((?<bcc>.+)\)|NIL) (?:\((?<inReplyTo>.+)\)|NIL) (?:"<(?<messageId>.+)>"|NIL|"")\)/

function unfoldMessage(raw: string): string {
  return raw.replaceAll(/\r\n[ \t]/g, ' ').replaceAll(/ {8}/g, ' ')
}

export function fetchResponseParser(rawResponse: string): FetchParseResult {
  const unfoldedRaw = unfoldMessage(rawResponse)

  const responseMatch = unfoldedRaw.match(FETCH_RESPONSE_REGEX)
  if (!responseMatch?.groups) {
    throw new SimplexIMAPError('Unexpected error while parsing fetch')
  }

  const raw = responseMatch.groups.raw

  const uidMatch = raw.match(UID_REGEX)
  const sizeMatch = raw.match(SIZE_REGEX)

  const dateMatch = raw.match(INTERNALDATE_REGEX)
  let internalDate: Date | null = null
  if (dateMatch?.groups?.internalDate) {
    internalDate = new Date(dateMatch.groups.internalDate)
  }

  let flags: string[] = []
  const flagsMatch = raw.match(FLAGS_REGEX)
  if (flagsMatch?.groups?.flags) {
    flags = flagsMatch.groups.flags.split(' ')
  }

  const headers: MessageHeadersParsed = {
    list: [],
    from: null,
    to: null,
    subject: null,
    date: null,
    messageId: null,
    contentType: null,
    mimeVersion: null,
  }

  const headersMatch = raw.match(BODY_HEADER_REGEX)
  if (headersMatch?.groups?.headers) {
    const headersMatchAll = headersMatch?.groups?.headers.matchAll(/^(?<name>[\w-]+): ?(?<value>.*)(?:\r\n)?/gm)
    headers.list = [...headersMatchAll]
      .map((match) => {
        if (!match.groups?.name || !match.groups?.value) return false

        return { name: match.groups?.name, value: match.groups?.value }
      })
      .filter((i) => !!i)

    // TODO: Add support of CC and other headers
    const fromValue = headers.list.find((i) => i.name === 'From')?.value
    const toValue = headers.list.find((i) => i.name === 'To')?.value

    const dateValue = headers.list.find((i) => i.name === 'Date')?.value
    const messageIdValue = headers.list.find((i) => i.name === 'Message-ID')?.value
    const messageId = messageIdValue?.match(/<(?<id>.*)>/)?.groups?.id
    const contentTypeValue = headers.list.find((i) => i.name === 'Content-Type')?.value

    headers.from = fromValue ? parseAddressFromHeaders(fromValue) : null
    headers.to = toValue ? parseAddressFromHeaders(toValue) : null
    headers.subject = headers.list.find((i) => i.name === 'Subject')?.value || null
    headers.date = dateValue ? new Date(dateValue) : null
    headers.messageId = messageId || null
    headers.contentType = contentTypeValue ? parseContentType(contentTypeValue) : null
    headers.mimeVersion = headers.list.find((i) => i.name === 'MIME-Version')?.value || null
  }

  const envelopeMatch = raw.match(ENVELOPE_REGEX)
  const envelope: EnvelopeParsed = {
    date: envelopeMatch?.groups?.date ? new Date(envelopeMatch.groups.date) : null,
    subject: envelopeMatch?.groups?.subject || null,
    from: envelopeMatch?.groups?.from ? parseAddressFromEnvelope(envelopeMatch?.groups?.from) : null,
    sender: envelopeMatch?.groups?.sender ? parseAddressFromEnvelope(envelopeMatch?.groups?.sender) : null,
    replyTo: envelopeMatch?.groups?.replyTo ? parseAddressFromEnvelope(envelopeMatch?.groups?.replyTo) : null,
    to: envelopeMatch?.groups?.to ? parseAddressFromEnvelope(envelopeMatch?.groups?.to) : null,
    cc: envelopeMatch?.groups?.cc ? parseAddressFromEnvelope(envelopeMatch?.groups?.cc) : null,
    bcc: envelopeMatch?.groups?.bcc ? parseAddressFromEnvelope(envelopeMatch?.groups?.bcc)[0] : null,
    inReplyTo: envelopeMatch?.groups?.inReplyTo ? parseAddressFromEnvelope(envelopeMatch?.groups?.inReplyTo)[0] : null,
    messageId: envelopeMatch?.groups?.messageId || null,
  }

  return {
    body: undefined,
    envelope,
    flags,
    headers,
    internalDate,
    raw,
    size: sizeMatch?.groups?.size ? Number(sizeMatch.groups.size) : null,
    uid: uidMatch?.groups?.uid ? Number(uidMatch.groups.uid) : null,
  }
}
