import { imapRawLogger } from 'logger'

export class RawIMAPError extends Error {
  constructor(message: string, ...data: any[]) {
    super(data ? 'Error from raw-imap lib. Detail above' : message)
    this.name = 'RawIMAPError'
    if (data) imapRawLogger.err(message, ...data)
  }
}