import type { SimplexIMAP } from '@/main.js'
import type { FetchConfig } from '@/methods/fetch/types.js'

export class Message {
  public uid: number
  public readonly connection: SimplexIMAP

  constructor(connection: SimplexIMAP, uid: number) {
    this.uid = uid
    this.connection = connection
  }

  async fetch(config?: FetchConfig) {
    return await this.connection.fetch(this.uid, config)
  }
}
