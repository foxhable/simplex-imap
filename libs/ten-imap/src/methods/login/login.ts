import { IMAP_STATUSES, type IMAPCredentials } from 'imap-raw/types'
import type TenIMAP from '../../main.js'

export async function login(this: TenIMAP, credentials?: IMAPCredentials) {
  await this._waitStatus(IMAP_STATUSES.READY)

  if (credentials?.username && credentials?.password) {
    return await this.send('LOGIN', credentials)
  }

  if (this._config.credentials?.username && this._config.credentials.password) {
    return await this.send('LOGIN', this._config.credentials)
  }

  throw new Error('No credentials in init config and arguments')
}