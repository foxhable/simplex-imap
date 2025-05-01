import type { SimplexIMAP } from '@/main.js'
import { fetchResponseParser } from '@/methods/fetch/response-parser/index.js'
import { IMAPError } from '@/shared/logger/index.js'
import type { SequenceSet } from '@/shared/sequence-set/types.js'
import { convertSequenceSetToString } from '@/shared/sequence-set/index.js'
import type { FetchConfig } from './config-parser/types.js'
import { parseFetchConfig } from './config-parser/index.js'
import { IMAP_STATES } from '@/entities/imap/index.js'

export async function fetch(this: SimplexIMAP, sequenceSet: SequenceSet, config: FetchConfig = 'ALL') {
  await this._methodCallPreparation()

  if (this._state !== IMAP_STATES.SELECTED) {
    throw new IMAPError('IMAP not in SELECTED state. You need select mailbox first by SimplexIMAP.select()')
  }

  const criteria = parseFetchConfig(config)

  const res = await this.send('FETCH', {
    sequenceSet: convertSequenceSetToString(sequenceSet),
    criteria,
  })

  return fetchResponseParser(res.response.raw)
}
