import { IMAPError } from '@/shared/logger/index.js'
import type { SimplexIMAP } from '@/main.js'
import { Mailbox } from '@/entities/mailbox/index.js'
import { parseMailbox } from './lib/parseMailbox.js'

export async function mailboxes(this: SimplexIMAP) {
  await this._methodCallPreparation()

  const res = await this.send('LIST', {
    refName: '""',
    mailbox: '"*"',
  })

  if (!res.ok) throw new IMAPError(res.body, { res })

  return res.response.lines.map((line) => {
    const parsed = parseMailbox(line.body)
    return new Mailbox(this, parsed)
  })
}
