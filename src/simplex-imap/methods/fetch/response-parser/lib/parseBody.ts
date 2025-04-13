import { parseContentType } from './parseContentType.js'

export interface BodyParsed {
  section: string
  text: string | null
  contentType: string | null
  charset: string | null
  encoding: string | null
}

export type MimeValues = {
  [index: string]: string | null
}

export type FetchBodyParseResult = Array<BodyParsed & MimeValues> | null

const BODY_SPECIFIED_REGEX = /BODY\[(?<section>[\d.]+)] {\d+}\r\n(?<body>.*)\r\n/g
const BODY_MIME_REGEX = /BODY\[(?<section>[\d.]+).(MIME|HEADER)] \{\d+}\r\n(?<headers>.+)(?:\r\n)+/g
export const BODY_WITH_HEADERS_REGEX =
  /BODY\[] {\d+}\r\n(?<headers>(?:[\w-]+: ?.+\r\n)+)\r\n(?<bodyList>(?<boundary>--.+)\r\n[\w\W\r\n]+)/

export function parseBody(response: string): FetchBodyParseResult {
  const body: FetchBodyParseResult = []

  const bodyWithHeadersMatch = response.match(BODY_WITH_HEADERS_REGEX)
  const bodyMatchList = response.matchAll(BODY_SPECIFIED_REGEX)

  for (const match of bodyMatchList) {
    if (!match.groups?.section || !match.groups?.body) continue

    const section = match.groups.section
    const indexOfSection = body!.findIndex((bodyItem) => bodyItem.section === section)

    const bodyObject = {
      charset: null,
      contentType: null,
      encoding: null,
      section,
      text: match.groups.body,
    }

    if (indexOfSection === -1) {
      body.push(bodyObject)
    } else body![indexOfSection] = bodyObject
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

      const bodyObject = {
        charset: contentTypeParsed.charset,
        contentType: contentTypeParsed.type,
        encoding: contentTypeParsed.encoding,
        section,
        text: match?.groups?.content,
      }

      if (indexOfSection === -1) {
        body!.push(bodyObject)
      } else {
        body![indexOfSection] = bodyObject
      }
    })
  }

  const mimeBodyMatchList = response.matchAll(BODY_MIME_REGEX)
  for (const match of mimeBodyMatchList) {
    if (!match.groups?.headers || !match.groups?.section) continue

    const section = match.groups.section
    const indexOfSection = body!.findIndex((bodyItem) => bodyItem.section === section)

    // TODO: parse all headers
    const contentTypeParsed = parseContentType(match?.groups.headers)

    const bodyObject = {
      charset: contentTypeParsed.charset,
      contentType: contentTypeParsed.type,
      encoding: contentTypeParsed.encoding,
      section,
      text: null,
    }

    if (indexOfSection === -1) {
      body!.push(bodyObject)
    } else {
      body![indexOfSection] = bodyObject
    }
  }

  return body.length ? body : null
}
