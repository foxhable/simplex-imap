import type TenIMAP from '../../main.js'
import { IMAP_STATUSES } from 'imap-raw/types'
import { TenIMAPError } from '../../general/error.js'

export async function close(this: TenIMAP) {
  await this._waitStatus(IMAP_STATUSES.READY)

  const res = await this.send('CLOSE')

  if (!res.ok) {
    this.selectedMailbox = null
    throw new TenIMAPError(res.body, { res })
  }

  this.selectedMailbox = null
}