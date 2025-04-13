import { IMAPError } from '@/logger/main.js'
import { IMAP_STATUSES } from '@/low-level-imap/types/index.js'
import type { SimplexIMAP } from '@/main.js'
import { Message } from '@/simplex-imap/entities/message/index.js'
import type { SearchFilter } from '@/simplex-imap/methods/search/filter-parser/parseSearchFilter.js'
import { parseSearchResponse } from '@/simplex-imap/methods/search/lib/parseSearchResponse.js'
import { parseSearchFilter } from './filter-parser/index.js'

export type SearchMethodConfig = { raw: string } | SearchFilter

export async function search(this: SimplexIMAP, config: SearchMethodConfig) {
  await this._waitStatus(IMAP_STATUSES.READY)

  const criteria = 'raw' in config ? config.raw : parseSearchFilter(config)
  const res = await this.send('SEARCH', { criteria })

  if (!res.ok) {
    this.selectedMailbox = null
    throw new IMAPError(res.body, { res })
  }

  const messageIDs = parseSearchResponse(res.response.lines[0].raw)
  return messageIDs.map((id) => new Message(this, id))
}
