export interface SearchContentFilter {
  subject?: string[]
  body?: string[]
  text?: string[]
}

export function parseContentFilter(filter: SearchContentFilter) {
  const result: string[] = []

  filter.subject?.forEach((item) => result.push(`SUBJECT "${item}"`))
  filter.body?.forEach((item) => result.push(`BODY "${item}"`))
  filter.text?.forEach((item) => result.push(`TEXT "${item}"`))

  return result.join(' ')
}
