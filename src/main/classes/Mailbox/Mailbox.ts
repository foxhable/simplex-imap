import type { TenIMAP } from '@/main/types/index.js'
import type { SelectMethodConfig } from '@/main/types/index.js'

export interface MailboxData {
  name: string
}

export class Mailbox {
  public readonly connection: TenIMAP

  public name: string

  constructor(connection: TenIMAP, data: MailboxData) {
    this.name = data.name
    this.connection = connection
  }

  public async select(config?: Omit<SelectMethodConfig, 'mailbox'>) {
    return await this.connection.select(this.name, Object.assign({ mailbox: this } as const, config))
  }
}
