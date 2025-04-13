import type { EnvelopeParsed, FetchParseResult, MessageHeadersParsed } from '@/simplex-imap/methods/fetch/types.js'
import { IMAPError } from '@/logger/main.js'
import { parseAddressFromEnvelope, parseAddressFromHeaders } from '@/simplex-imap/methods/fetch/addressParser.js'
import { parseContentType } from '@/simplex-imap/methods/fetch/contentTypeParser.js'

const FETCH_RESPONSE_REGEX = /\d+ FETCH \((?<raw>[\W\w]*)+\)/
const UID_REGEX = /UID (?<uid>\d+)/
const SIZE_REGEX = /RFC822.SIZE (?<size>\d+)/
const INTERNALDATE_REGEX = /INTERNALDATE "(?<internalDate>\d{2}-\w{3}-\d{4} (\d\d:?){3} \+\d{4})"/
const FLAGS_REGEX = /FLAGS \((?<flags>(?:[\w\\$]+ ?)*)\)/
const BODY_HEADER_REGEX = /BODY\[HEADER] \{\d+}\r\n(?<headers>[\W\w]*)\r\n/
const ENVELOPE_REGEX =
  /ENVELOPE \((?:"(?<date>.*)"|NIL|"") (?:"(?<subject>.*)"|""|NIL) (?:\((?<from>.+)\)|NIL) (?:\((?<sender>.+)\)|NIL) (?:\((?<replyTo>.+)\)|NIL) (?:\((?<to>.+)\)|NIL) (?:\((?<cc>.+)\)|NIL) (?:\((?<bcc>.+)\)|NIL) (?:\((?<inReplyTo>.+)\)|NIL) (?:"<(?<messageId>.+)>"|NIL|"")\)/
const BODY_SPECIFIED_REGEX = /BODY\[(?<section>[\d.]+)] {\d+}\r\n(?<body>.*)\r\n/g
const BODY_WITH_HEADERS_REGEX =
  /BODY\[] {\d+}\r\n(?<headers>(?:[\w-]+: ?.+\r\n)+)\r\n(?<bodyList>(?<boundary>--.+)\r\n[\w\W\r\n]+)/
const BODY_MIME_REGEX = /BODY\[(?<section>[\d.]+).(MIME|HEADER)] \{\d+}\r\n(?<headers>.+)(?:\r\n)+/g

function unfoldMessage(raw: string): string {
  return raw.replaceAll(/\r\n[ \t]/g, ' ').replaceAll(/ {8}/g, ' ')
}

function parseHeaders(headersString: string): MessageHeadersParsed {
  const headersMatchAll = headersString.matchAll(/^(?<name>[\w-]+): ?(?<value>.*)(?:\r\n)?/gm)

  const headersList = [...headersMatchAll]
    .map((match) => {
      if (!match.groups?.name || !match.groups?.value) return false

      return { name: match.groups?.name, value: match.groups?.value }
    })
    .filter((i) => !!i)

  // TODO: Add support of CC and other headers
  const fromValue = headersList.find((i) => i.name === 'From')?.value
  const toValue = headersList.find((i) => i.name === 'To')?.value

  const dateValue = headersList.find((i) => i.name === 'Date')?.value
  const messageIdValue = headersList.find((i) => i.name === 'Message-ID')?.value
  const messageId = messageIdValue?.match(/<(?<id>.*)>/)?.groups?.id
  const contentTypeValue = headersList.find((i) => i.name === 'Content-Type')?.value
  const subject = headersList.find((i) => i.name === 'Subject')?.value || null
  const mimeVersion = headersList.find((i) => i.name === 'MIME-Version')?.value || null

  return {
    list: headersList,
    from: fromValue ? parseAddressFromHeaders(fromValue) : null,
    to: toValue ? parseAddressFromHeaders(toValue) : null,
    subject,
    date: dateValue ? new Date(dateValue) : null,
    messageId: messageId || null,
    contentType: contentTypeValue ? parseContentType(contentTypeValue) : null,
    mimeVersion,
  }
}

// TODO: Add parsing of BODYSTRUCTURE
export function fetchResponseParser(rawResponse: string): FetchParseResult {
  const unfoldedRaw = unfoldMessage(rawResponse)

  const responseMatch = unfoldedRaw.match(FETCH_RESPONSE_REGEX)
  if (!responseMatch?.groups) {
    throw new IMAPError('Unexpected error while parsing fetch')
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

  let headers: MessageHeadersParsed = {
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
    headers = parseHeaders(headersMatch?.groups?.headers)
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

  let body: FetchParseResult['body'] = []

  const bodyMatchList = [...raw.matchAll(BODY_SPECIFIED_REGEX)]
  bodyMatchList.forEach((bodyMatch) => {
    if (!bodyMatch.groups?.section || !bodyMatch.groups?.body) return

    const section = bodyMatch.groups.section
    const indexOfSection = body!.findIndex((bodyItem) => bodyItem.section === section)

    const newObject = {
      charset: null,
      contentType: null,
      encoding: null,
      section,
      text: bodyMatch.groups.body,
    }

    if (indexOfSection === -1) {
      body!.push(newObject)
    } else {
      body![indexOfSection] = newObject
    }
  })

  const bodyWithHeadersMatch = raw.match(BODY_WITH_HEADERS_REGEX)
  if (bodyWithHeadersMatch?.groups?.headers) {
    headers = parseHeaders(bodyWithHeadersMatch?.groups?.headers)
  }

  if (bodyWithHeadersMatch?.groups?.bodyList && bodyWithHeadersMatch?.groups.boundary) {
    const bodyList = bodyWithHeadersMatch?.groups.bodyList
      .split(bodyWithHeadersMatch?.groups.boundary)
      .filter((i) => i !== '\r\n' && i !== '')

    bodyList?.forEach((item, index) => {
      const match = item.match(/\r\n(?:(?<headers>(?:[\w-]+: ?.+(?:\r\n)?)+)\r\n\r\n)?(?<content>[\w\W\r\n]*)\r\n\r\n/)

      if (!match?.groups?.content) return

      const section = (index + 1).toString()
      const indexOfSection = body!.findIndex((bodyItem) => bodyItem.section === section)

      const contentTypeParsed = parseContentType(match?.groups?.headers || '')

      const newObject = {
        charset: contentTypeParsed.charset,
        contentType: contentTypeParsed.type,
        encoding: contentTypeParsed.encoding,
        section,
        text: match?.groups?.content,
      }

      if (indexOfSection === -1) {
        body!.push(newObject)
      } else {
        body![indexOfSection] = newObject
      }
    })
  }

  const mimeBodyMatchList = [...raw.matchAll(BODY_MIME_REGEX)]
  mimeBodyMatchList.forEach((match) => {
    if (!match.groups?.headers || !match.groups?.section) return

    const section = match.groups.section
    const indexOfSection = body!.findIndex((bodyItem) => bodyItem.section === section)

    // TODO: parse all headers
    const contentTypeParsed = parseContentType(match?.groups.headers)

    const newObject = {
      charset: contentTypeParsed.charset,
      contentType: contentTypeParsed.type,
      encoding: contentTypeParsed.encoding,
      section,
      text: null,
    }

    if (indexOfSection === -1) {
      body!.push(newObject)
    } else {
      body![indexOfSection] = newObject
    }
  })

  if (!body.length) body = null

  return {
    body,
    envelope,
    flags,
    headers,
    internalDate,
    raw,
    size: sizeMatch?.groups?.size ? Number(sizeMatch.groups.size) : null,
    uid: uidMatch?.groups?.uid ? Number(uidMatch.groups.uid) : null,
  }
}
