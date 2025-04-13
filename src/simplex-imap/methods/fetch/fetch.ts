import { IMAP_STATUSES } from '@/low-level-imap/types/index.js'
import type { SequenceSet, SimplexIMAP } from '@/simplex-imap/types.js'
import type { FetchConfig } from '@/simplex-imap/methods/fetch/types.js'
import { convertSequenceSetToString } from '@/simplex-imap/general/sequenceSet/sequenceSet.js'
import { parseFetchConfig } from '@/simplex-imap/methods/fetch/fetchConfigParser.js'

export async function fetch(this: SimplexIMAP, sequenceSet: SequenceSet, config: FetchConfig = 'ALL') {
  await this._waitStatus(IMAP_STATUSES.READY)

  const criteria = parseFetchConfig(config)

  const res = await this.send('FETCH', {
    sequenceSet: convertSequenceSetToString(sequenceSet),
    criteria,
  })

  return res.response.raw
}
