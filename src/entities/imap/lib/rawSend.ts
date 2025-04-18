import { imapRawLogger as logger } from '@/logger/main.js'
import type { IMAP } from '../class/IMAP.js'
import { IMAP_STATUSES } from '../model/IMAPStatus.js'

export async function rawSend(this: IMAP, data: string) {
  if (!this._connection) throw new Error('Connection not created')
  await this._waitStatus(IMAP_STATUSES.READY)

  const _tag = this._getTag()

  const body = `${_tag} ${data}\r\n`

  this._connection.write(body)
  logger.log('Sent message, body:\n', { data: { body } })
  return await this._response(_tag)
}
