import type { HeaderField } from '../model/HeaderFields.js'

export interface SearchHeadersFilter {
  bcc?: string[]
  cc?: string[]
  from?: string[]
  to?: string[]
  header?: { field: HeaderField; value: string }[]
}

export function parseHeadersFilter(filter: SearchHeadersFilter) {
  const result: string[] = []

  filter.header?.forEach((item) => result.push(`HEADER ${item.field} ${item.value}`))
  filter.bcc?.forEach((item) => result.push(`BCC "${item}"`))
  filter.cc?.forEach((item) => result.push(`CC "${item}"`))
  filter.from?.forEach((item) => result.push(`FROM ${item}`))
  filter.to?.forEach((item) => result.push(`TO ${item}`))

  return result.join(' ')
}
