import type { FetchConfig } from '@/main/methods/fetch/types.js'
import type { SimplexIMAP } from '@/main.js'

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
