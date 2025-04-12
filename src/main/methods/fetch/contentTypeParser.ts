import type { ContentType } from '@/main/methods/fetch/types.js'

const MIME_TYPE_REGEX = /(?<type>\w+\/\w+);?/
const BOUNDARY_REGEX = /boundary="(?<boundary>.*)";?/

export function parseContentType(raw: string): ContentType {
  const mimeValue = raw.match(MIME_TYPE_REGEX)?.groups?.type
  const boundaryValue = raw.match(BOUNDARY_REGEX)?.groups?.boundary

  return {
    type: mimeValue || '',
    boundary: boundaryValue || null,
  }
}
