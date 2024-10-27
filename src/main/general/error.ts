import { simplexImapLogger } from '@/logger/main.js'

export class SimplexIMAPError extends Error {
  public data: any[]

  constructor(message: string, ...data: any[]) {
    super(data ? 'Error from simplex-imap lib. Detail above' : message)
    this.name = 'SimplexIMAPError'
    this.data = data
    if (data) simplexImapLogger.err(message, ...data)
  }
}
