import { connect as createTLSConnection, type TLSSocket } from "tls";
import { createConnection as createTCPConnection, type Socket } from 'net'
import { ExtractMethodArgs, IMAPMethod } from "./types/methods.js";

export interface TLSOptions {
  readonly ca: string
}

export interface IMAPConfig {
  readonly host: string
  readonly port?: number
  readonly tls?: boolean
  readonly tlsOptions?: TLSOptions
}

const defaultConfig = {
  port: 993,
  tls: true,
} as const satisfies Partial<IMAPConfig>

type DefaultIMAPConfig = typeof defaultConfig

function createIMAPConfig(userConfig?: IMAPConfig) {
  return Object.assign(defaultConfig, userConfig)
}

type IMAPConnection = TLSSocket | Socket

export default class IMAP {
  private _config: DefaultIMAPConfig & IMAPConfig
  private _connection: IMAPConnection

  constructor(config: IMAPConfig) {
    this._config = createIMAPConfig(config)
    this._connection = this.createConnection()
  }

  createConnection(): IMAPConnection {
    let connection

    const _config = {
      host: this._config.host,
      port: this._config.port,
    }

    if (this._config.tls) connection = createTLSConnection(_config)
    if (!this._config.tls) connection = createTCPConnection(_config)

    if (!connection) throw new Error('Error while creating connection')

    return connection
  }

  send<TMethod extends IMAPMethod>(method: TMethod, args?: ExtractMethodArgs<TMethod>) {

  }
}