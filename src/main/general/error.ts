import { simplexImapLogger } from '@/logger/main.js'

export class TenIMAPError extends Error {
  public data: any[]

  constructor(message: string, ...data: any[]) {
    super(data ? 'Error from simplex-imap lib. Detail above' : message)
    this.name = 'TenIMAPError'
    this.data = data
    if (data) simplexImapLogger.err(message, ...data)
  }
}
