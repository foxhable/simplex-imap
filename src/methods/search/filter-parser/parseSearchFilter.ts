import type { SequenceSet } from '@/shared/sequence-set/types.js'
import { convertSequenceSetToString } from '@/shared/sequence-set/index.js'
import { parseContentFilter, type SearchContentFilter } from './lib/parseContentFilter.js'
import { parseDateFilter, type SearchDateFilter } from './lib/parseDateFilter.js'
import { parseFlagsFilter, type SearchFlagFilter } from './lib/parseFlagsFilter.js'
import { parseHeadersFilter, type SearchHeadersFilter } from './lib/parseHeadersFilter.js'
import { parseLogicalFilter, type SearchLogicalFilter } from './lib/parseLogicalFilter.js'
import { parsePropsFilter, type SearchPropsFilter } from './lib/parsePropsFilter.js'

export type SearchFilter =
  | {
      sequenceSet?: SequenceSet
      flags?: SearchFlagFilter
      headers?: SearchHeadersFilter
      date?: SearchDateFilter
      content?: SearchContentFilter
      props?: SearchPropsFilter
      logical?: SearchLogicalFilter
    }
  | { all: true }

export function parseSearchFilter(config: SearchFilter) {
  if ('all' in config) return 'ALL'

  const result: string[] = []

  if (typeof config.headers !== 'undefined') {
    result.push(parseHeadersFilter(config.headers))
  }

  if (typeof config.content !== 'undefined') {
    result.push(parseContentFilter(config.content))
  }

  if (typeof config.date !== 'undefined') {
    result.push(parseDateFilter(config.date))
  }

  if (typeof config.props !== 'undefined') {
    result.push(parsePropsFilter(config.props))
  }

  if (typeof config.flags !== 'undefined') {
    result.push(parseFlagsFilter(config.flags))
  }

  if (typeof config.logical !== 'undefined') {
    result.push(parseLogicalFilter(config.logical))
  }

  if (typeof config.sequenceSet !== 'undefined') {
    result.push(convertSequenceSetToString(config.sequenceSet))
  }

  return result.join(' ')
}
