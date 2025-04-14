import type { ResponseStatus } from './ResponseStatus.js'
import { type ResponseCode } from './ResponseCode.js'

export type IMAPTag = '*' | string

export interface IMAPResponseLine {
  tag: IMAPTag
  body: string
  raw: string
}

export type IMAPResult = {
  tag: IMAPTag
  ok: boolean
  status: ResponseStatus
  body: string
  code: ResponseCode | null
  raw: string
  response: {
    lines: IMAPResponseLine[]
    raw: string
  }
} & (
  | {
      ok: true
      status: Exclude<ResponseStatus, 'NO' | 'BAD'>
    }
  | {
      ok: false
      status: Extract<ResponseStatus, 'NO' | 'BAD'>
    }
)
