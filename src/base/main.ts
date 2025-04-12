import { connect as createTLSConnection } from 'node:tls'
import { createConnection as createTCPConnection } from 'node:net'
import { imap as utf7imap } from 'utf7'
import { Buffer } from 'node:buffer'
import { imapRawLogger as logger } from '@/logger/main.js'
import { hasResultLine, parseIMAPResponse } from './functions/parser.js'

import type {
  ExtractMethodArgs,
  IMAPConfig,
  IMAPConnection,
  IMAPMethod,
  IMAPResult,
  IMAPStatus,
  MethodWithArgs,
  MethodWithoutArgs,
} from './types/index.js'
import { IMAP_STATUSES, LOG_LEVELS } from './types/index.js'
import { RawIMAPError } from './general/error.js'

export default class IMAP {
  protected readonly _defaultConfig = {
    port: 993,
    tls: true,
    connectOnCreating: true,
    logLevel: LOG_LEVELS.NONE,
  } as const satisfies Partial<IMAPConfig>

  protected readonly _config: typeof this._defaultConfig & IMAPConfig
  protected _connection: IMAPConnection | null = null

  protected _tag: number = 0

  constructor(config: IMAPConfig) {
    this._config = this._createIMAPConfig(config)
    logger.setLogLevel(config.logLevel || this._defaultConfig.logLevel)

    if (this._config.connectOnCreating) {
      this._connection = this._createConnection()
    }
  }

  protected _status: IMAPStatus = IMAP_STATUSES.NOT_CONNECTED

  public get status() {
    return this._status
  }

  public async connect() {
    this._connection = this._createConnection()
  }

  public async rawSend(data: string) {
    if (!this._connection) throw new Error('Connection not created')
    await this._waitStatus(IMAP_STATUSES.READY)

    const _tag = this._getTag()

    const body = `${_tag} ${data}\r\n`

    this._connection.write(body)
    logger.log('Sent message, body:\n', body)
    return await this._response(_tag)
  }

  public async send<TMethod extends MethodWithoutArgs>(method: TMethod): Promise<IMAPResult>
  public async send<TMethod extends MethodWithArgs>(
    method: TMethod,
    args: ExtractMethodArgs<TMethod>,
  ): Promise<IMAPResult>
  public async send<TMethod extends IMAPMethod>(
    method: TMethod,
    args?: ExtractMethodArgs<TMethod>,
  ): Promise<IMAPResult> {
    if (!this._connection) throw new Error('Connection not created')
    await this._waitStatus(IMAP_STATUSES.READY)

    const _tag = this._getTag()

    const _args = args ? ` ${Object.values(args).join(' ')}` : ''
    const body = `${_tag} ${method}${_args}\r\n`

    this._connection.write(body)
    logger.log('Sent message, body:\n', body)
    return await this._response(_tag)
  }

  protected _waitStatus(targetStatus: IMAPStatus) {
    return new Promise<void>((resolve) => {
      if (this._status === targetStatus) resolve()

      setTimeout(() => this._waitStatus(targetStatus).then(resolve), 50)
    })
  }

  protected _createIMAPConfig(userConfig?: IMAPConfig) {
    return Object.assign(this._defaultConfig, userConfig)
  }

  protected _createConnection(): IMAPConnection {
    const _config = {
      host: this._config.host,
      port: this._config.port,
    }

    const connection = this._config.tls ? createTLSConnection(_config) : createTCPConnection(_config)

    if (!connection) throw new RawIMAPError('Error while creating connection')

    connection.once('connect', () => (this._status = IMAP_STATUSES.CONNECTED))
    connection.once('data', () => (this._status = IMAP_STATUSES.READY))
    connection.once('close', this.disconnect)
    connection.once('timeout', this.disconnect)

    return connection
  }

  public async disconnect() {
    const timeout = setTimeout(this._connection!.destroy, 15000)
    if (this._connection) await this.send('LOGOUT')
    clearTimeout(timeout)
    this._status = IMAP_STATUSES.DISCONNECTED
    this._connection = null
    logger.log('Connection was closed')
  }

  protected _getTag(): string {
    return String(++this._tag)
  }

  buffer: Buffer[] = []

  protected async _response(tag: string): Promise<IMAPResult> {
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
}
