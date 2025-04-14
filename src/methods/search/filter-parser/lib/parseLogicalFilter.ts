import { parseSearchFilter, type SearchFilter } from '../parseSearchFilter.js'

export interface SearchLogicalFilter {
  not?: SearchFilter[]
  or?: [SearchFilter, SearchFilter][]
}

export function parseLogicalFilter(filter: SearchLogicalFilter) {
  const result: string[] = []

  filter.not?.forEach((filter) => result.push(`NOT ${parseSearchFilter(filter)}`))

  filter.or?.forEach(([filter1, filter2]) => {
    result.push(`OR ${parseSearchFilter(filter1)} ${parseSearchFilter(filter2)}`)
  })

  return result.join(' ')
}
