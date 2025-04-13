import type { ContentType } from '@/simplex-imap/methods/fetch/types.js'

const MIME_TYPE_REGEX = /(?<type>\w+\/\w+);?/
const BOUNDARY_REGEX = /boundary="(?<boundary>.*)";?/
const CHARSET_REGEX = /charset="(?<charset>.*)";?/
const ENCODING_REGEX = /encoding="(?<encoding>.*)";?/

export function parseContentType(raw: string): ContentType {
  const mimeValue = raw.match(MIME_TYPE_REGEX)?.groups?.type
  const boundaryValue = raw.match(BOUNDARY_REGEX)?.groups?.boundary
  const charsetValue = raw.match(CHARSET_REGEX)?.groups?.charset
  const encodingValue = raw.match(ENCODING_REGEX)?.groups?.encoding

  return {
    type: mimeValue || '',
    boundary: boundaryValue || null,
    charset: charsetValue || null,
    encoding: encodingValue || null,
  }
}
