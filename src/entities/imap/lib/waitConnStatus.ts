import type { IMAP } from '../class/IMAP.js'
import type { IMAPConnStatus } from '../model/IMAPConnStatus.js'

export function waitConnStatus(this: IMAP, targetStatus: IMAPConnStatus) {
  return new Promise<void>((resolve) => {
    if (this._connStatus === targetStatus) resolve()

    setTimeout(() => this._waitConnStatus(targetStatus).then(resolve), 50)
  })
}
