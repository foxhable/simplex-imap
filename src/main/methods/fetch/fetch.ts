import { IMAP_STATUSES } from '@/low-level-imap/types/index.js'
import type { SequenceSet, SimplexIMAP } from '@/main/types.js'
import type { FetchConfig } from '@/main/methods/fetch/types.js'
import { convertSequenceSetToString } from '@/main/general/sequenceSet/sequenceSet.js'
import { parseFetchConfig } from '@/main/methods/fetch/fetchConfigParser.js'

export async function fetch(this: SimplexIMAP, sequenceSet: SequenceSet, config: FetchConfig = 'ALL') {
  await this._waitStatus(IMAP_STATUSES.READY)

  const criteria = parseFetchConfig(config)

  const res = await this.send('FETCH', {
    sequenceSet: convertSequenceSetToString(sequenceSet),
    criteria,
  })

  return res.response.raw
}
