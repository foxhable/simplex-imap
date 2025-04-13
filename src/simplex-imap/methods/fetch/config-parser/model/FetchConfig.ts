import type {
  PartialSlice,
  SectionAndPartialSlice,
  SectionPartObject,
} from '@/simplex-imap/methods/fetch/config-parser/lib/parseSectionAndPartial.js'

export const FETCH_MACROS = {
  ALL: 'ALL',
  FAST: 'FAST',
  FULL: 'FULL',
} as const

export type FetchMacro = (typeof FETCH_MACROS)[keyof typeof FETCH_MACROS]

export const HEADER_FIELDS_NAMES = {
  ORIG_DATE: 'Date',
  FROM: 'From',
  SENDER: 'Sender',
  REPLY_TO: 'Reply-To',
  TO: 'To',
  CC: 'Cc',
  BCC: 'Bcc',
  MESSAGE_ID: 'Message-ID',
  IN_REPLY_TO: 'In-Reply-To',
  REFERENCES: 'References',
  SUBJECT: 'Subject',
  COMMENTS: 'Comments',
  KEYWORDS: 'Keywords',
  RESENT_DATE: 'Resent-Date',
  RESENT_FROM: 'Resent-From',
  RESENT_SENDER: 'Resent-Sender',
  RESENT_TO: 'Resent-To',
  RESENT_CC: 'Resent-Cc',
  RESENT_BCC: 'Resent-Bcc',
  RESENT_MSG_ID: 'Resent-Message-ID',
  RETURN: 'Return-Path',
  RECEIVED: 'Received',
} as const

export type HeaderFieldName = (typeof HEADER_FIELDS_NAMES)[keyof typeof HEADER_FIELDS_NAMES]

export type FetchDataItem = {
  body?: boolean | SectionAndPartialSlice
  bodyHeader?: boolean | SectionAndPartialSlice
  bodyHeaderFields?: { fieldNames: Array<string | HeaderFieldName>; not?: boolean } & SectionAndPartialSlice
  bodyMime?: Required<SectionPartObject> & PartialSlice
  bodyText?: boolean | SectionAndPartialSlice
  bodyStructure?: boolean
  envelope?: boolean
  flags?: boolean
  internaldate?: boolean
  size?: boolean
  uid?: boolean
}

export type FetchConfig =
  | FetchMacro
  | FetchDataItem
  | FetchDataItem[]
  | {
      raw: string
    }
