import { tenImapLogger } from 'logger'

export class TenIMAPError extends Error {
  public data: any[]

  constructor(message: string, ...data: any[]) {
    super(data ? 'Error from ten-imap lib. Detail above' : message)
    this.name = 'TenIMAPError'
    this.data = data
    if (data) tenImapLogger.err(message, ...data)
  }
}