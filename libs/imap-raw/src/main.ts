import { connect as createTLSConnection, type TLSSocket } from "tls";
import { createConnection as createTCPConnection, type Socket } from 'net'
import { ExtractMethodArgs, IMAPMethod, MethodWithArgs, MethodWithoutArgs } from "./types/methods.js";

export interface TLSOptions {
  readonly ca: string
}

export interface IMAPConfig {
  readonly host: string
  readonly port?: number
  readonly tls?: boolean
  readonly tlsOptions?: TLSOptions
}

type IMAPConnection = TLSSocket | Socket

export default class IMAP {
  protected readonly _defaultConfig = {
    port: 993,
    tls: true,
  } as const satisfies Partial<IMAPConfig>

  protected readonly _config: typeof this._defaultConfig & IMAPConfig
  protected readonly _connection: IMAPConnection

  protected _tag: number = 0

  constructor(config: IMAPConfig) {
    this._config = this._createIMAPConfig(config)
    this._connection = this.createConnection()
  }

  protected _createIMAPConfig(userConfig?: IMAPConfig) {
    return Object.assign(this._defaultConfig, userConfig)
  }

  createConnection(): IMAPConnection {
    const _config = {
      host: this._config.host,
      port: this._config.port,
    }

    const connection = this._config.tls ? createTLSConnection(_config) : createTCPConnection(_config)

    if (!connection) throw new Error('Error while creating connection')

    return connection
  }

  protected _getTag(): string {
    return String(++this._tag)
  }

  send<TMethod extends MethodWithoutArgs>(method: TMethod): void
  send<TMethod extends MethodWithArgs>(method: TMethod, args: ExtractMethodArgs<TMethod>): void
  send<TMethod extends IMAPMethod>(method: TMethod, args?: ExtractMethodArgs<TMethod>): void {
    const _args = args ? ` ${Object.values(args).join(' ')}` : ''
    const body = `${this._getTag()} ${method}` + _args + '\r\n'

    this._connection.write(body)
  }
}