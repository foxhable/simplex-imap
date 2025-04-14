import type { IMAP } from '../class/IMAP.js'
import type { IMAPStatus } from '../model/IMAPStatus.js'

export function waitStatus(this: IMAP, targetStatus: IMAPStatus) {
  return new Promise<void>((resolve) => {
    if (this._status === targetStatus) resolve()

    setTimeout(() => this._waitStatus(targetStatus).then(resolve), 50)
  })
}
