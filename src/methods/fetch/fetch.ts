import type { SimplexIMAP } from '@/main.js'
import type { SequenceSet } from '@/shared/sequence-set/types.js'
import { convertSequenceSetToString } from '@/shared/sequence-set/index.js'
import type { FetchConfig } from './config-parser/types.js'
import { parseFetchConfig } from './config-parser/index.js'

export async function fetch(this: SimplexIMAP, sequenceSet: SequenceSet, config: FetchConfig = 'ALL') {
  const criteria = parseFetchConfig(config)

  const res = await this.send('FETCH', {
    sequenceSet: convertSequenceSetToString(sequenceSet),
    criteria,
  })

  return res.response.raw
}
