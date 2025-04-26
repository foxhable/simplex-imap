import { EventEmitter } from 'node:events'
import { imap as utf7imap } from 'utf7'
import { connect as createTLSConnection, type ConnectionOptions } from 'node:tls'
import { createConnection as createTCPConnection, type NetConnectOpts } from 'node:net'
import { IMAPError, imapRawLogger } from '@/shared/logger/index.js'
import type { IMAP } from '../class/IMAP.js'
import { IMAP_CONN_STATUSES } from '../model/IMAPConnStatus.js'

export interface IMAPConnection extends EventEmitter {
  write: (buffer: string | Uint8Array) => boolean
  destroy: () => void
}

export function createConnection(this: IMAP): IMAPConnection {
  const defaultPort = this._config.tls ? 993 : 143

  const _config = {
    host: this._config.host,
    port: this._config.port || defaultPort,
  }

  const tcpConfig: NetConnectOpts = _config

  const tlsConfig: ConnectionOptions = Object.assign(_config, this._config.tlsOptions)

  const connection = this._config.tls ? createTLSConnection(tlsConfig) : createTCPConnection(tcpConfig)

  if (!connection) throw new IMAPError('Error while creating connection')

  connection.once('connect', () => (this._connStatus = IMAP_CONN_STATUSES.CONNECTED))
  connection.once('data', () => (this._connStatus = IMAP_CONN_STATUSES.READY))
  connection.once('close', this.disconnect)
  connection.once('timeout', this.disconnect)

  connection.on('data', (data) => {
    imapRawLogger.log('New message:\n', { data: utf7imap.decode(data.toString()) })
  })

  return connection
}
