import { IMAP_STATUSES, type IMAPCredentials } from '@/low-level-imap/types/index.js'
import type { SimplexIMAP } from '@/main.js'
import { IMAPError } from '@/logger/main.js'

export async function login(this: SimplexIMAP, credentials?: IMAPCredentials) {
  await this._waitStatus(IMAP_STATUSES.READY)

  const _credentials = {
    username: `"${credentials?.username || this._config.credentials?.username || ''}"`,
    password: `"${credentials?.password || this._config.credentials?.password || ''}"`,
  }

  if (!_credentials.username || !_credentials.password) {
    throw new IMAPError('No credentials in init config and arguments')
  }

  const res = await this.send('LOGIN', _credentials)

  if (!res.ok) {
    throw new IMAPError(res.body, { res })
  }

  return res
}
