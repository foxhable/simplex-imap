import type TenIMAP from '@/main/main.js'
import { IMAP_STATUSES } from '@/base/types/index.js'
import { TenIMAPError } from '@/main/general/error.js'
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