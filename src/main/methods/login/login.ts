import { IMAP_STATUSES, type IMAPCredentials } from '@/base/types/index.js'
import type { TenIMAP } from '@/main.js'
import { TenIMAPError } from '@/main/general/error.js'

export async function login(this: TenIMAP, credentials?: IMAPCredentials) {
  await this._waitStatus(IMAP_STATUSES.READY)

  const _credentials = {
    username: credentials?.username || this._config.credentials?.username || '',
    password: credentials?.password || this._config.credentials?.password || '',
  }

  if (!_credentials.username || !_credentials.password) {
    throw new TenIMAPError('No credentials in init config and arguments')
  }

  const res = await this.send('LOGIN', _credentials)

  if (!res.ok) {
    throw new TenIMAPError(res.body, { res })
  }

  return res
}
