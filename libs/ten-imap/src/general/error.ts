import { tenImapLogger } from 'logger'

export class TenIMAPError extends Error {
  constructor(message: string, ...data: any[]) {
    super(data ? 'Error from ten-imap lib. Detail above' : message)
    this.name = 'TenIMAPError'
    if (data) tenImapLogger.err(message, ...data)
  }
}