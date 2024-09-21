import { EventEmitter } from "events";

export interface IMAPConnection extends EventEmitter {
  write: (buffer: string | Uint8Array) => boolean
  destroy: () => void
}