import type { SimplexIMAP } from '@/main.js'
import { IMAPError } from '@/shared/logger/index.js'
import { type IMAPCredentials } from '@/entities/imap/types.js'
import { IMAP_STATES } from '@/entities/imap/index.js'

export async function login(this: SimplexIMAP, credentials?: IMAPCredentials) {
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

  this._state = IMAP_STATES.AUTH

  return res
}
