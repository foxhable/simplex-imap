import type { SimplexIMAP } from '@/main.js'
import { IMAP_STATUSES } from '@/low-level-imap/types/index.js'
import { IMAPError } from '@/logger/main.js'
import type { UnselectMethodConfig } from './types.js'

export async function unselect(this: SimplexIMAP, config?: UnselectMethodConfig) {
  await this._waitStatus(IMAP_STATUSES.READY)

  const res = await this.send(config?.expunge ? 'CLOSE' : 'UNSELECT')

  if (!res.ok) {
    this.selectedMailbox = null
    throw new IMAPError(res.body, { res })
  }

  this.selectedMailbox = null
}
