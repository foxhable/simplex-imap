import type { SimplexIMAP } from '@/main.js'
import { IMAP_STATUSES } from '@/base/types/index.js'
import { SimplexIMAPError } from '@/main/general/error.js'
import type {
  SearchFilter,
  SearchFilterByFlag,
  SearchFilterContent,
  SearchFilterDate,
  SearchFilterHeaders,
  SearchFilterLogical,
  SearchFilterProps,
  SearchMethodConfig,
} from './types.js'
import { convertToIMAPDate } from '@/main/general/date/date.js'
import { Message } from '@/main/classes/Mailbox/Message.js'

export async function search(this: SimplexIMAP, config: SearchMethodConfig) {
  await this._waitStatus(IMAP_STATUSES.READY)

  const criteria = 'raw' in config ? config.raw : generateSearchFilter(config)
  const res = await this.send('SEARCH', { criteria })

  if (!res.ok) {
    this.selectedMailbox = null
    throw new SimplexIMAPError(res.body, { res })
  }

  const messageIDs = parseSearchResponse(res.response.lines[0].raw)
  return messageIDs.map((id) => new Message(id))
}

export function generateSearchFilter(config: SearchFilter) {
  if ('all' in config) return 'ALL'

  const result: string[] = []

  if (typeof config.headers !== 'undefined') {
    result.push(generateHeadersSearchFilter(config.headers))
  }

  if (typeof config.content !== 'undefined') {
    result.push(generateContentSearchFilter(config.content))
  }

  if (typeof config.date !== 'undefined') {
    result.push(generateDateSearchFilter(config.date))
  }

  if (typeof config.props !== 'undefined') {
    result.push(generatePropsSearchFilter(config.props))
  }

  if (typeof config.flags !== 'undefined') {
    result.push(generateFlagsSearchFilter(config.flags))
  }

  if (typeof config.logical !== 'undefined') {
    result.push(generateLogicalSearchFilter(config.logical))
  }

  return result.join(' ')
}

function generateHeadersSearchFilter(filter: SearchFilterHeaders) {
  const result: string[] = []

  filter.header?.forEach((item) => result.push(`HEADER ${item.field} ${item.value}`))
  filter.bcc?.forEach((item) => result.push(`BCC "${item}"`))
  filter.cc?.forEach((item) => result.push(`CC "${item}"`))
  filter.from?.forEach((item) => result.push(`FROM ${item}`))
  filter.to?.forEach((item) => result.push(`TO ${item}`))

  return result.join(' ')
}

function generateDateSearchFilter(filter: SearchFilterDate) {
  const result: string[] = []

  filter.on?.forEach((date) => result.push(`ON ${convertToIMAPDate(date)}`))
  filter.sentOn?.forEach((date) => result.push(`SENTON ${convertToIMAPDate(date)}`))
  filter.since?.forEach((date) => result.push(`SINCE ${convertToIMAPDate(date)}`))
  filter.sentSince?.forEach((date) => result.push(`SENTSINCE ${convertToIMAPDate(date)}`))
  filter.before?.forEach((date) => result.push(`BEFORE ${convertToIMAPDate(date)}`))
  filter.sentBefore?.forEach((date) => result.push(`SENTBEFORE ${convertToIMAPDate(date)}`))

  return result.join(' ')
}

function generateContentSearchFilter(filter: SearchFilterContent) {
  const result: string[] = []

  filter.subject?.forEach((item) => result.push(`SUBJECT "${item}"`))
  filter.body?.forEach((item) => result.push(`BODY "${item}"`))
  filter.text?.forEach((item) => result.push(`TEXT "${item}"`))

  return result.join(' ')
}

function generatePropsSearchFilter(filter: SearchFilterProps) {
  const result: string[] = []

  filter.uid?.forEach((item) => result.push(`UID ${item}`))
  filter.keyword?.forEach((item) => result.push(`KEYWORD ${item}`))
  filter.unKeyword?.forEach((item) => result.push(`UNKEYWORD ${item}`))
  filter.larger?.forEach((item) => result.push(`LARGER ${item}`))
  filter.smaller?.forEach((item) => result.push(`SMALLER ${item}`))

  return result.join(' ')
}

function generateFlagsSearchFilter(filter: SearchFilterByFlag) {
  const result: string[] = []

  if (typeof filter.answered === 'boolean') {
    result.push(filter.answered ? 'ANSWERED' : 'UNANSWERED')
  }

  if (typeof filter.deleted === 'boolean') {
    result.push(filter.deleted ? 'DELETED' : 'UNDELETED')
  }

  if (typeof filter.draft === 'boolean') {
    result.push(filter.draft ? 'DRAFT' : 'UNDRAFT')
  }

  if (typeof filter.seen === 'boolean') {
    result.push(filter.seen ? 'SEEN' : 'UNSEEN')
  }

  if (typeof filter.flagged === 'boolean') {
    result.push(filter.flagged ? 'FLAGGED' : 'UNFLAGGED')
  }

  if (typeof filter.new === 'boolean') {
    result.push(filter.new ? 'NEW' : 'OLD')
  }

  return result.join(' ')
}

function generateLogicalSearchFilter(filter: SearchFilterLogical) {
  const result: string[] = []

  filter.not?.forEach((filter) => result.push(`NOT ${generateSearchFilter(filter)}`))

  filter.or?.forEach(([filter1, filter2]) => {
    result.push(`OR ${generateSearchFilter(filter1)} ${generateSearchFilter(filter2)}`)
  })

  return result.join(' ')
}

export function parseSearchResponse(res: string): number[] {
  const result = res
    .match(/(\d+ |\d+$)/g)
    ?.map((i) => i.trim())
    .map(Number)

  return result || []
}
