import { IMAPError } from '@/logger/main.js'
import type { SimplexIMAP } from '@/main.js'
import { Mailbox } from '@/simplex-imap/entities/mailbox/index.js'
import { parseMailbox } from './lib/parseMailbox.js'

export async function mailboxes(this: SimplexIMAP) {
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
