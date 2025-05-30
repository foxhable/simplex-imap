import { IMAPError } from '@/shared/logger/index.js'
import type { SimplexIMAP } from '@/main.js'
import type { Mailbox } from '@/entities/mailbox/types.js'
import { SelectedMailbox } from '@/entities/mailbox/index.js'
import { IMAP_STATES } from '@/entities/imap/index.js'
import { parseSelectResponse, type SelectResponse } from './lib/parseSelectResponse.js'

export interface SelectMethodConfig {
  /** @description if true - using EXAMINE instead SELECT */
  readonly: boolean
  onlyParse?: boolean
  mailbox?: Mailbox
}

export async function select<TConfig extends SelectMethodConfig>(
  this: SimplexIMAP,
  mailbox: string,
  config?: TConfig,
): Promise<
  TConfig extends {
    onlyParse: infer ParseOption
  }
    ? ParseOption extends true
      ? SelectResponse
      : SelectedMailbox
    : SelectedMailbox
> {
  await this._methodCallPreparation()

  const res = await this.send(config?.readonly ? 'EXAMINE' : 'SELECT', { mailbox })

  if (!res.ok) {
    this.selectedMailbox = null
    throw new IMAPError(res.body, { res })
  }

  const parse = parseSelectResponse(res.response.lines)
  const selectedMailbox = new SelectedMailbox(this, { name: mailbox, mailbox: config?.mailbox })

  this.selectedMailbox = selectedMailbox

  this._state = IMAP_STATES.SELECTED

  // @ts-expect-error TS2322 fix later
  return config?.onlyParse ? parse : selectedMailbox
}
