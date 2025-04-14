import type { SimplexIMAP } from '@/main.js'
import type { SequenceSet } from '@/simplex-imap/shared/sequenceSet/types.js'
import { convertSequenceSetToString } from '@/simplex-imap/shared/sequenceSet/index.js'
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
