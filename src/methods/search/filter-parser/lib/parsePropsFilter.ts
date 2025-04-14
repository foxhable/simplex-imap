import type { MailboxFlag } from '@/entities/mailbox/types.js'

export interface SearchPropsFilter {
  uid?: string[]
  keyword?: MailboxFlag[]
  unKeyword?: MailboxFlag[]
  larger?: number[]
  smaller?: number[]
}

export function parsePropsFilter(filter: SearchPropsFilter) {
  const result: string[] = []

  filter.uid?.forEach((item) => result.push(`UID ${item}`))
  filter.keyword?.forEach((item) => result.push(`KEYWORD ${item}`))
  filter.unKeyword?.forEach((item) => result.push(`UNKEYWORD ${item}`))
  filter.larger?.forEach((item) => result.push(`LARGER ${item}`))
  filter.smaller?.forEach((item) => result.push(`SMALLER ${item}`))

  return result.join(' ')
}
