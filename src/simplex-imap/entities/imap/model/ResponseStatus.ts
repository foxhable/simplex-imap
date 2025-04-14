export const TAGGED_RESPONSES = {
  OK: 'OK',
  BAD: 'BAD',
  NO: 'NO',
} as const

export type TaggedResponse = (typeof TAGGED_RESPONSES)[keyof typeof TAGGED_RESPONSES]

export const UNTAGGED_RESPONSES = {
  PREAUTH: 'PREAUTH',
  BYE: 'BYE',
} as const

export type UntaggedResponse = (typeof UNTAGGED_RESPONSES)[keyof typeof UNTAGGED_RESPONSES]

export const RESPONSE_STATUSES = {
  ...TAGGED_RESPONSES,
  ...UNTAGGED_RESPONSES,
}

export type ResponseStatus = TaggedResponse | UntaggedResponse
