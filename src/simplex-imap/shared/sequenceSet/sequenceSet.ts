type SequenceRangeSet = { from: number; to?: number }

export type SequenceSet = number | Array<SequenceRangeSet | number> | SequenceRangeSet

function convertPartOfSequenceSetToString(sequenceSet: SequenceRangeSet | number): string {
  if (typeof sequenceSet === 'number') return sequenceSet.toString()

  return `${sequenceSet.from}:${sequenceSet.to || '*'}`
}

export function convertSequenceSetToString(sequenceSet: SequenceSet): string {
  if (sequenceSet instanceof Array) {
    return sequenceSet.map(convertPartOfSequenceSetToString).join(',')
  } else {
    return convertPartOfSequenceSetToString(sequenceSet)
  }
}
