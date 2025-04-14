import { IMAPError } from '@/logger/main.js'
import type { SimplexIMAP } from '@/main.js'
import type { Mailbox } from '@/simplex-imap/entities/mailbox/types.js'
import { SelectedMailbox } from '@/simplex-imap/entities/mailbox/index.js'
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
  const res = await this.send(config?.readonly ? 'EXAMINE' : 'SELECT', { mailbox })

  if (!res.ok) {
    this.selectedMailbox = null
    throw new IMAPError(res.body, { res })
  }

  const parse = parseSelectResponse(res.response.lines)
  const selectedMailbox = new SelectedMailbox(this, { name: mailbox, mailbox: config?.mailbox })

  this.selectedMailbox = selectedMailbox

  // @ts-expect-error TS2322 fix later
  return config?.onlyParse ? parse : selectedMailbox
}
