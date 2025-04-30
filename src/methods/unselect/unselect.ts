import { IMAPError } from '@/shared/logger/index.js'
import type { SimplexIMAP } from '@/main.js'
import { IMAP_STATES } from '@/entities/imap/index.js'

export interface UnselectMethodConfig {
  expunge?: boolean
}

export async function unselect(this: SimplexIMAP, config?: UnselectMethodConfig) {
  await this._methodCallPreparation()

  const res = await this.send(config?.expunge ? 'CLOSE' : 'UNSELECT')

  if (!res.ok) {
    this.selectedMailbox = null
    throw new IMAPError(res.body, { res })
  }

  this._state = IMAP_STATES.AUTH

  this.selectedMailbox = null
}
