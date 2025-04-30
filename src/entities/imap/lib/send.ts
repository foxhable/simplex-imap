import { imapRawLogger as logger } from '@/shared/logger/index.js'
import type { IMAP } from '../class/IMAP.js'
import { IMAP_CONN_STATUSES } from '../model/IMAPConnStatus.js'
import type { IMAPResult } from '../model/IMAPResult.js'
import type { ExtractMethodArgs, IMAPMethod, MethodsAll, MethodWithArgs } from '../model/methods.js'

export async function send<TMethod extends MethodsAll>(
  this: IMAP,
  method: TMethod,
  args?: TMethod extends MethodWithArgs ? ExtractMethodArgs<TMethod> : never,
): Promise<IMAPResult>
export async function send<TMethod extends IMAPMethod>(
  this: IMAP,
  method: TMethod,
  args?: ExtractMethodArgs<TMethod>,
): Promise<IMAPResult> {
  if (!this._connection) throw new Error('You are not connected. Call SimplexIMAP.connect() first')
  await this._waitConnStatus(IMAP_CONN_STATUSES.READY)

  const _tag = this._getTag()

  const _args = args ? ` ${Object.values(args).join(' ')}` : ''
  const body = `${_tag} ${method}${_args}\r\n`

  this._connection.write(body)
  logger.log('Sent message, body:\n', { data: { body } })
  return await this._response(_tag)
}
