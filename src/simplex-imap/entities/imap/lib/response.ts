import { Buffer } from 'node:buffer'
import { imap as utf7imap } from 'utf7'

import type { IMAP } from '../class/IMAP.js'
import type { IMAPResult } from '../model/IMAPResult.js'
import { hasResultLine, parseIMAPResponse } from './parseIMAPResponse.js'

export async function response(this: IMAP, tag: string): Promise<IMAPResult> {
  return new Promise<IMAPResult>((resolve) => {
    if (!this._connection) throw new Error('Connection not created')

    const onData = (data: Buffer) => {
      this.buffer.push(data)

      if (!hasResultLine(utf7imap.decode(data.toString()))) return

      const bufferString = utf7imap.decode(Buffer.concat(this.buffer).toString())

      const result = parseIMAPResponse(bufferString)

      if (result.tag !== tag) return

      this._connection?.removeListener('data', onData)
      this.buffer = []
      resolve(result)
    }

    this._connection.on('data', onData)
  })
}
