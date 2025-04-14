export type SearchFlagFilter = {
  answered?: boolean
  deleted?: boolean
  draft?: boolean
  seen?: boolean
  flagged?: boolean
  new?: boolean
}

export function parseFlagsFilter(filter: SearchFlagFilter) {
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
