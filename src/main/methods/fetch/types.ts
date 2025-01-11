import type { MessageFlag, MessageHeader } from '@/main/types.js'

export const FETCH_MACROS = {
  ALL: 'ALL',
  FAST: 'FAST',
  FULL: 'FULL',
} as const

export type FetchMacro = (typeof FETCH_MACROS)[keyof typeof FETCH_MACROS]

type SectionPart = number | string
type SectionPartObject = { sectionPart?: SectionPart }
type PartialSlice = { partial?: [number, number] | { from: number; to?: number } | number }
export type SectionAndPartialSlice = SectionPartObject & PartialSlice

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

export interface AddressItem {
  name: string | null
  email: string
}

export type AddressesList = AddressItem[]
export type ContentType = {
  type: string
  boundary: string | null
  charset: string | null
  encoding: string | null
}

export interface MessageHeadersParsed {
  list: MessageHeader[]
  from: AddressesList | null
  to: AddressesList | null
  subject: string | null
  date: Date | null
  messageId: string | null
  contentType: ContentType | null
  mimeVersion: string | null
}

export interface EnvelopeParsed {
  date: Date | null
  subject: string | null
  from: AddressesList | null
  sender: AddressesList | null
  replyTo: AddressesList | null
  to: AddressesList | null
  cc: AddressesList | null
  bcc: AddressItem | null
  inReplyTo: AddressItem | null
  messageId: string | null
}

export interface BodyParsed {
  section: string
  text: string | null
  contentType: string | null
  charset: string | null
  encoding: string | null
}

export type MimeValues = {
  [index: string]: string | null
}

export interface FetchParseResult {
  uid: null | number
  flags: Array<MessageFlag | string>
  size: number | null
  internalDate: Date | null
  headers: MessageHeadersParsed
  body: Array<BodyParsed & MimeValues> | null
  envelope: EnvelopeParsed
  raw: string
}
