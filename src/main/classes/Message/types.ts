export const MESSAGE_SYSTEM_FLAGS = {
  SEEN: '\\Seen',
  ANSWERED: '\\Answered',
  FLAGGED: '\\Flagged',
  DELETED: '\\Deleted',
  DRAFT: '\\Draft',
  RECENT: '\\Recent',
}

export type MessageSystemFlag = (typeof MESSAGE_SYSTEM_FLAGS)[keyof typeof MESSAGE_SYSTEM_FLAGS]

export const MESSAGE_FLAG_KEYWORDS = {
  FORWARDED: '$Forwarded',
  MDN_SENT: '$MDNSent',
  JUNK: '$Junk',
  NOT_JUNK: '$NotJunk',
  PHISHING: '$Phishing',
}

export type MessageFlagKeyword = (typeof MESSAGE_FLAG_KEYWORDS)[keyof typeof MESSAGE_FLAG_KEYWORDS]

export type MessageFlag = MessageSystemFlag | MessageFlagKeyword

export interface MessageHeader {
  name: string
  value: string
}
