import { convertToIMAPDate } from '@/shared/date/index.js'

export interface SearchDateFilter {
  before?: Date[]
  sentBefore?: Date[]
  on?: Date[]
  sentOn?: Date[]
  since?: Date[]
  sentSince?: Date[]
}

export function parseDateFilter(filter: SearchDateFilter) {
  const result: string[] = []

  filter.on?.forEach((date) => result.push(`ON ${convertToIMAPDate(date)}`))
  filter.sentOn?.forEach((date) => result.push(`SENTON ${convertToIMAPDate(date)}`))
  filter.since?.forEach((date) => result.push(`SINCE ${convertToIMAPDate(date)}`))
  filter.sentSince?.forEach((date) => result.push(`SENTSINCE ${convertToIMAPDate(date)}`))
  filter.before?.forEach((date) => result.push(`BEFORE ${convertToIMAPDate(date)}`))
  filter.sentBefore?.forEach((date) => result.push(`SENTBEFORE ${convertToIMAPDate(date)}`))

  return result.join(' ')
}
