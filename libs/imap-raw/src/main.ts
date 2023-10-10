import { connect as createTLSConnection, type TLSSocket } from "tls";
import { createConnection as createTCPConnection, type Socket } from 'net'
import { ExtractMethodArgs, IMAPMethod, MethodWithArgs, MethodWithoutArgs } from "./types/methods.js";
import { IMAPResponse } from "./types/response.js";
import { IMAP_STATUSES, IMAPConfig, IMAPStatus } from "./types/general.js";

type IMAPConnection = TLSSocket | Socket

export default class IMAP {
  protected readonly _TAG_MSG_REGEX = new RegExp(`([\\d*]+)`)

  protected readonly _defaultConfig = {
    port: 993,
    tls: true,
    connectOnCreating: true,
  } as const satisfies Partial<IMAPConfig>

  protected readonly _config: typeof this._defaultConfig & IMAPConfig
  protected _connection: IMAPConnection | null = null

  protected _tag: number = 0

  protected _status: IMAPStatus = IMAP_STATUSES.NOT_CONNECTED
  get status() {
    return this._status
  }


  constructor(config: IMAPConfig) {
    this._config = this._createIMAPConfig(config)
    this._connection = this.createConnection()

    if (this._config.connectOnCreating) {
      this._connection = this._createConnection()
    }
  }

  async connect() {
    this._connection = this._createConnection()
  }


  async send<TMethod extends MethodWithoutArgs>(method: TMethod): Promise<void>
  async send<TMethod extends MethodWithArgs>(method: TMethod, args: ExtractMethodArgs<TMethod>): Promise<void>
  async send<TMethod extends IMAPMethod>(method: TMethod, args?: ExtractMethodArgs<TMethod>): Promise<void> {
    if (!this._connection) throw new Error('Connection not created')
    await this._waitStatus(IMAP_STATUSES.READY)

    const _tag = this._getTag()

    const _args = args ? ` ${Object.values(args).join(' ')}` : ''
    const body = `${_tag} ${method}${_args}\r\n`

    this._connection.write(body)
  }

  protected _waitStatus(targetStatus: IMAPStatus) {
    return new Promise<void>(resolve => {
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

    if (!connection) throw new Error('Error while creating connection')

    connection.once('data', data => {
      this._status = IMAP_STATUSES.READY
    })

    connection.on('data', data => {
      console.log(data.toString())
    })

    return connection
  }

  protected _getTag(): string {
    return String(++this._tag)
  }
}