import { IMAPError } from '@/logger/main.js'
import { IMAP_STATUSES } from '@/low-level-imap/types/index.js'
import type { SimplexIMAP } from '@/main.js'

export interface UnselectMethodConfig {
  expunge?: boolean
}

export async function unselect(this: SimplexIMAP, config?: UnselectMethodConfig) {
  await this._waitStatus(IMAP_STATUSES.READY)

  const res = await this.send(config?.expunge ? 'CLOSE' : 'UNSELECT')

  if (!res.ok) {
    this.selectedMailbox = null
    throw new IMAPError(res.body, { res })
  }

  this.selectedMailbox = null
}
