import type { SimplexIMAP } from '@/main.js'
import type { SelectMethodConfig } from '@/main/types.js'

export interface MailboxData {
  name: string
}

export class Mailbox {
  public readonly connection: SimplexIMAP

  public name: string

  constructor(connection: SimplexIMAP, data: MailboxData) {
    this.name = data.name
    this.connection = connection
  }

  public async select(config?: Omit<SelectMethodConfig, 'mailbox'>) {
    return await this.connection.select(this.name, Object.assign({ mailbox: this } as const, config))
  }
}
