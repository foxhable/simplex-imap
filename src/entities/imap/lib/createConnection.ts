import { EventEmitter } from 'node:events'
import { imap as utf7imap } from 'utf7'
import { connect as createTLSConnection } from 'node:tls'
import { createConnection as createTCPConnection } from 'node:net'
import { IMAPError, imapRawLogger } from '@/logger/main.js'
import type { IMAP } from '../class/IMAP.js'
import { IMAP_STATUSES } from '../model/IMAPStatus.js'

export interface IMAPConnection extends EventEmitter {
  write: (buffer: string | Uint8Array) => boolean
  destroy: () => void
}

export function createConnection(this: IMAP): IMAPConnection {
  const _config = {
    host: this._config.host,
    port: this._config.port,
  }

  const connection = this._config.tls ? createTLSConnection(_config) : createTCPConnection(_config)

  if (!connection) throw new IMAPError('Error while creating connection')

  connection.once('connect', () => (this._status = IMAP_STATUSES.CONNECTED))
  connection.once('data', () => (this._status = IMAP_STATUSES.READY))
  connection.once('close', this.disconnect)
  connection.once('timeout', this.disconnect)

  connection.on('data', (data) => {
    imapRawLogger.log('New message:\n', { data: utf7imap.decode(data.toString()) })
  })

  return connection
}
