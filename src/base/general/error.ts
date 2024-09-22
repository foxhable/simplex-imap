import { imapRawLogger } from '@/logger/main.js'

export class RawIMAPError extends Error {
  public data: any[]

  constructor(message: string, ...data: any[]) {
    super(data ? 'Error from raw-imap lib. Detail above' : message)
    this.name = 'RawIMAPError'
    this.data = data
    if (data) imapRawLogger.err(message, ...data)
  }
}