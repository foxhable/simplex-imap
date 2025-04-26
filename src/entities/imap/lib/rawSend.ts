import { imapRawLogger as logger } from '@/shared/logger/index.js'
import type { IMAP } from '../class/IMAP.js'
import { IMAP_CONN_STATUSES } from '../model/IMAPConnStatus.js'

export async function rawSend(this: IMAP, data: string) {
  if (!this._connection) throw new Error('Connection not created')
  await this._waitConnStatus(IMAP_CONN_STATUSES.READY)

  const _tag = this._getTag()

  const body = `${_tag} ${data}\r\n`

  this._connection.write(body)
  logger.log('Sent message, body:\n', { data: { body } })
  return await this._response(_tag)
}
