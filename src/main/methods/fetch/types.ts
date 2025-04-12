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

type AddressesList = AddressItem[]

interface MessageHeadersParsed {
  list: MessageHeader
  from: AddressesList | null
  to: AddressesList | null
  subject: string | null
  date: Date | null
  messageId: string | null
  contentType: { type: string; boundary: string | null } | null
  mimeVersion: string | null
}

interface EnvelopeParsed {
  date: Date | null
  subject: string | null
  from: AddressesList | null
  sender: AddressesList | null
  replyTo: AddressesList | null
  to: AddressesList | null
  cc: AddressesList | null
  bcc: string | null
  inReplyTo: string | null
  messageId: string | null
}

export interface BodyParsed {
  section: number
  text: string
  contentType: string | null
  charset: string | null
  encoding: string | null
}

type OtherMimeValues = {
  [index: string]: string
}

export interface FetchParseResult {
  uid: null | number
  flags: Array<MessageFlag | string>
  size: number | null
  internalDate: Date
  headers: MessageHeadersParsed
  body: Array<BodyParsed & OtherMimeValues> | null
  envelope: EnvelopeParsed
  raw: string
}
