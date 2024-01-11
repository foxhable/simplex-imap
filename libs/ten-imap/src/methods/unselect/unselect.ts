import type TenIMAP from '../../main.js'
import { IMAP_STATUSES } from 'imap-raw/types'
import { TenIMAPError } from '../../general/error.js'
import type { UnselectMethodConfig } from './types.js'

export async function unselect(this: TenIMAP, config?: UnselectMethodConfig) {
  await this._waitStatus(IMAP_STATUSES.READY)

  const res = await this.send(config?.expunge ? 'CLOSE' : 'UNSELECT')

  if (!res.ok) {
    this.selectedMailbox = null
    throw new TenIMAPError(res.body, { res })
  }

  this.selectedMailbox = null
}