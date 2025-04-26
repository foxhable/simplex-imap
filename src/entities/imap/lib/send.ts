import { imapRawLogger as logger } from '@/shared/logger/index.js'
import type { IMAP } from '../class/IMAP.js'
import { IMAP_CONN_STATUSES } from '../model/IMAPConnStatus.js'
import type { IMAPResult } from '../model/IMAPResult.js'
import type { ExtractMethodArgs, IMAPMethod, MethodWithArgs, MethodWithoutArgs } from '../model/methods.js'

export async function send<TMethod extends MethodWithoutArgs>(this: IMAP, method: TMethod): Promise<IMAPResult>
export async function send<TMethod extends MethodWithArgs>(
  this: IMAP,
  method: TMethod,
  args: ExtractMethodArgs<TMethod>,
): Promise<IMAPResult>
export async function send<TMethod extends IMAPMethod>(
  this: IMAP,
  method: TMethod,
  args?: ExtractMethodArgs<TMethod>,
): Promise<IMAPResult> {
  if (!this._connection) throw new Error('Connection not created')
  await this._waitConnStatus(IMAP_CONN_STATUSES.READY)

  const _tag = this._getTag()

  const _args = args ? ` ${Object.values(args).join(' ')}` : ''
  const body = `${_tag} ${method}${_args}\r\n`

  this._connection.write(body)
  logger.log('Sent message, body:\n', { data: { body } })
  return await this._response(_tag)
}
