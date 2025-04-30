import { IMAP_STATES } from '@/entities/imap/index.js'
import { IMAPError } from '@/shared/logger/index.js'
import type { SimplexIMAP } from '@/main.js'
import { Message } from '@/entities/message/index.js'
import type { SearchFilter } from './filter-parser/parseSearchFilter.js'
import { parseSearchResponse } from './lib/parseSearchResponse.js'
import { parseSearchFilter } from './filter-parser/index.js'

export type SearchMethodConfig = { raw: string } | SearchFilter

export async function search(this: SimplexIMAP, config: SearchMethodConfig) {
  await this._methodCallPreparation()

  if (this._state !== IMAP_STATES.SELECTED) {
    throw new IMAPError('IMAP not in SELECTED state. You need select mailbox first by SimplexIMAP.select()')
  }

  const criteria = 'raw' in config ? config.raw : parseSearchFilter(config)
  const res = await this.send('SEARCH', { criteria })

  if (!res.ok) {
    this.selectedMailbox = null
    throw new IMAPError(res.body, { res })
  }

  const messageIDs = parseSearchResponse(res.response.lines[0].raw)
  return messageIDs.map((id) => new Message(this, id))
}
