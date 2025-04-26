import { imapRawLogger as logger } from '@/shared/logger/index.js'

import type { IMAP } from '../class/IMAP.js'
import { IMAP_CONN_STATUSES } from '../model/IMAPConnStatus.js'

export async function disconnect(this: IMAP) {
  const timeout = setTimeout(this._connection!.destroy, 15000)
  if (this._connection) await this.send('LOGOUT')
  clearTimeout(timeout)
  this._connStatus = IMAP_CONN_STATUSES.DISCONNECTED
  this._connection = null
  logger.log('Connection was closed')
}
