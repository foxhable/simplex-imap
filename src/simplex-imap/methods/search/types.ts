import type { MailboxFlag } from '@/simplex-imap/classes/Mailbox/types.js'
import type { SequenceSet } from '@/simplex-imap/general/sequenceSet/sequenceSet.js'

export const HEADER_FIELDS = {
  TRACE: 'trace',
  RESENT_DATE: 'resent-date',
  RESENT_FROM: 'resent-from',
  RESENT_SENDER: 'resent-sender',
  RESENT_TO: 'resent-to',
  RESENT_CC: 'resent-cc',
  RESENT_BCC: 'resent-bcc',
  RESENT_MSG_ID: 'resent-msg-id',
  ORIG_DATE: 'orig-date',
  FROM: 'from',
  SENDER: 'sender',
  REPLY_TO: 'reply-to',
  TO: 'to',
  CC: 'cc',
  BCC: 'bcc',
  MESSAGE_ID: 'message-id',
  IN_REPLY_TO: 'in-reply-to',
  REFERENCES: 'references',
  SUBJECT: 'subject',
  COMMENTS: 'comments',
  KEYWORDS: 'keywords',
  OPTIONAL_FIELD: 'optional-field',
} as const

export type HeaderField = (typeof HEADER_FIELDS)[keyof typeof HEADER_FIELDS]

export interface SearchFilterHeaders {
  bcc?: string[]
  cc?: string[]
  from?: string[]
  to?: string[]
  header?: { field: HeaderField; value: string }[]
}

export interface SearchFilterDate {
  before?: Date[]
  sentBefore?: Date[]
  on?: Date[]
  sentOn?: Date[]
  since?: Date[]
  sentSince?: Date[]
}

export interface SearchFilterContent {
  subject?: string[]
  body?: string[]
  text?: string[]
}

export interface SearchFilterProps {
  uid?: string[]
  keyword?: MailboxFlag[]
  unKeyword?: MailboxFlag[]
  larger?: number[]
  smaller?: number[]
}

export interface SearchFilterLogical {
  not?: SearchFilter[]
  or?: [SearchFilter, SearchFilter][]
}

export type SearchFilterByFlag = {
  answered?: boolean
  deleted?: boolean
  draft?: boolean
  seen?: boolean
  flagged?: boolean
  new?: boolean
}

export type SearchFilter =
  | {
      sequenceSet?: SequenceSet
      flags?: SearchFilterByFlag
      headers?: SearchFilterHeaders
      date?: SearchFilterDate
      content?: SearchFilterContent
      props?: SearchFilterProps
      logical?: SearchFilterLogical
    }
  | { all: true }

export type SearchMethodConfig = { raw: string } | SearchFilter
