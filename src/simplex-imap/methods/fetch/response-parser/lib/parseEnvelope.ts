import { type AddressesList, type AddressItem, parseAddressFromEnvelope } from './parseAddress.js'

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

const ENVELOPE_REGEX =
  /ENVELOPE \((?:"(?<date>.*)"|NIL|"") (?:"(?<subject>.*)"|""|NIL) (?:\((?<from>.+)\)|NIL) (?:\((?<sender>.+)\)|NIL) (?:\((?<replyTo>.+)\)|NIL) (?:\((?<to>.+)\)|NIL) (?:\((?<cc>.+)\)|NIL) (?:\((?<bcc>.+)\)|NIL) (?:\((?<inReplyTo>.+)\)|NIL) (?:"<(?<messageId>.+)>"|NIL|"")\)/

export function parseEnvelope(response: string): EnvelopeParsed {
  const envelopeMatch = response.match(ENVELOPE_REGEX)

  return {
    date: envelopeMatch?.groups?.date ? new Date(envelopeMatch.groups.date) : null,
    subject: envelopeMatch?.groups?.subject || null,
    from: envelopeMatch?.groups?.from ? parseAddressFromEnvelope(envelopeMatch?.groups?.from) : null,
    sender: envelopeMatch?.groups?.sender ? parseAddressFromEnvelope(envelopeMatch?.groups?.sender) : null,
    replyTo: envelopeMatch?.groups?.replyTo ? parseAddressFromEnvelope(envelopeMatch?.groups?.replyTo) : null,
    to: envelopeMatch?.groups?.to ? parseAddressFromEnvelope(envelopeMatch?.groups?.to) : null,
    cc: envelopeMatch?.groups?.cc ? parseAddressFromEnvelope(envelopeMatch?.groups?.cc) : null,
    bcc: envelopeMatch?.groups?.bcc ? parseAddressFromEnvelope(envelopeMatch?.groups?.bcc)[0] : null,
    inReplyTo: envelopeMatch?.groups?.inReplyTo ? parseAddressFromEnvelope(envelopeMatch?.groups?.inReplyTo)[0] : null,
    messageId: envelopeMatch?.groups?.messageId || null,
  }
}
