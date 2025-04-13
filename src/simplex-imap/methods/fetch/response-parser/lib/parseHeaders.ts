import { BODY_WITH_HEADERS_REGEX } from './parseBody.js'
import { type AddressesList, parseAddressFromHeaders } from './parseAddress.js'
import { type ContentType, parseContentType } from './parseContentType.js'

export interface MessageHeader {
  name: string
  value: string
}

export interface MessageHeadersParsed {
  list: MessageHeader[]
  from: AddressesList | null
  to: AddressesList | null
  subject: string | null
  date: Date | null
  messageId: string | null
  contentType: ContentType | null
  mimeVersion: string | null
}

const BODY_HEADER_REGEX = /BODY\[HEADER] \{\d+}\r\n(?<headers>[\W\w]*)\r\n/

export function parseHeaders(response: string): MessageHeadersParsed {
  const defaultValues: MessageHeadersParsed = {
    list: [],
    from: null,
    to: null,
    subject: null,
    date: null,
    messageId: null,
    contentType: null,
    mimeVersion: null,
  }

  const headersMatch = response.match(BODY_HEADER_REGEX)
  // Duplicate of regex match from parseBody
  const bodyWithHeadersMatch = response.match(BODY_WITH_HEADERS_REGEX)
  const headersString = bodyWithHeadersMatch?.groups?.headers || headersMatch?.groups?.headers

  if (!headersString) return defaultValues

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
