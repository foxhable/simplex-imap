import { imapRawLogger as logger } from '@/logger/main.js'

import type { IMAP } from '../class/IMAP.js'
import { IMAP_STATUSES } from '../model/IMAPStatus.js'

export async function disconnect(this: IMAP) {
  const timeout = setTimeout(this._connection!.destroy, 15000)
  if (this._connection) await this.send('LOGOUT')
  clearTimeout(timeout)
  this._status = IMAP_STATUSES.DISCONNECTED
  this._connection = null
  logger.log('Connection was closed')
}
