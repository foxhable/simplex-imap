import type { IMAPTag } from './general.js'

export const TAGGED_RESPONSES = {
  OK: 'OK',
  BAD: 'BAD',
  NO: 'NO',
} as const

export type TaggedResponse = typeof TAGGED_RESPONSES[keyof typeof TAGGED_RESPONSES]

export const UNTAGGED_RESPONSES = {
  PREAUTH: 'PREAUTH',
  BYE: 'BYE',
} as const

export type UntaggedResponse = typeof UNTAGGED_RESPONSES[keyof typeof UNTAGGED_RESPONSES]

export const RESPONSE_STATUSES = {
  ...TAGGED_RESPONSES,
  ...UNTAGGED_RESPONSES,
}

export type ResponseStatus = TaggedResponse | UntaggedResponse

export interface IMAPResponseLine {
  tag: IMAPTag
  body: string
  raw: string
}

export interface IMAPResult {
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
}

export const RESPONSE_CODES = {
  ALERT: 'ALERT',
  ALREADYEXISTS: 'ALREADYEXISTS',
  APPENDUID: 'APPENDUID',
  AUTHENTICATIONFAILED: 'AUTHENTICATIONFAILED',
  AUTHORIZATIONFAILED: 'AUTHORIZATIONFAILED',
  BADCHARSET: 'BADCHARSET',
  CANNOT: 'CANNOT',
  CAPABILITY: 'CAPABILITY',
  CLIENTBUG: 'CLIENTBUG',
  CLOSED: 'CLOSED',
  CONTACTADMIN: 'CONTACTADMIN',
  COPYUID: 'COPYUID',
  CORRUPTION: 'CORRUPTION',
  EXPIRED: 'EXPIRED',
  EXPUNGEISSUED: 'EXPUNGEISSUED',
  HASCHILDREN: 'HASCHILDREN',
  INUSE: 'INUSE',
  LIMIT: 'LIMIT',
  NONEXISTENT: 'NONEXISTENT',
  NOPERM: 'NOPERM',
  OVERQUOTA: 'OVERQUOTA',
  PARSE: 'PARSE',
  PERMANENTFLAGS: 'PERMANENTFLAGS',
  PRIVACYREQUIRED: 'PRIVACYREQUIRED',
  READ_ONLY: 'READ-ONLY',
  READ_WRITE: 'READ-WRITE',
  SERVERBUG: 'SERVERBUG',
  TRYCREATE: 'TRYCREATE',
  UIDNEXT: 'UIDNEXT',
  UIDNOTSTICKY: 'UIDNOTSTICKY',
  UIDVALIDITY: 'UIDVALIDITY',
  UNAVAILABLE: 'UNAVAILABLE',
  UNKNOWN_CTE: 'UNKNOWN-CTE',
} as const

export type ResponseCode = typeof RESPONSE_CODES[keyof typeof RESPONSE_CODES]
