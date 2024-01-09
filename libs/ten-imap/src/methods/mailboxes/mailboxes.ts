import type TenIMAP from '../../main.js'
import type { ParsedMailbox } from './types.js'
import { TenIMAPError } from '../../general/error.js'
import { Mailbox } from '../../classes/Mailbox/Mailbox.js'
import type { MailboxAttribute } from '../../classes/Mailbox/types.js'
import { MAILBOX_ATTRIBUTES } from '../../classes/Mailbox/types.js'

export async function mailboxes(this: TenIMAP) {
  const res = await this.send(
    'LIST',
    {
      refName: '""',
      mailbox: '"*"',
    },
  )

  if (!res.ok) throw new TenIMAPError(res.body, { res })

  const list = res.response.lines.map(line => {
    const parsedData = parseMailbox(line.body)
    return [ parsedData.name, parsedData ] as const
  })

  return new MailboxMap(this, list)
}

const MAILBOX_ATTRIBUTES_LIST_REGEX_PART = Object.values(MAILBOX_ATTRIBUTES).map(i => `\\${i}`).join('|')
const MAILBOX_ATTRIBUTES_REGEX_PART = `\\(((?:(?:${MAILBOX_ATTRIBUTES_LIST_REGEX_PART}) ?)*)\\)`
const DELIMITER_REGEX_PART = '(?:"(.+)"|NIL)'
const MAILBOX_NAME_REGEX_PART = '"(.+)"'
const MAILBOX_PARSE_REGEX = new RegExp(`LIST ${MAILBOX_ATTRIBUTES_REGEX_PART} ${DELIMITER_REGEX_PART} ${MAILBOX_NAME_REGEX_PART}`)

function parseMailbox(text: string): ParsedMailbox {
  const match = text.match(MAILBOX_PARSE_REGEX)

  if (!match) {
    throw new TenIMAPError('LIST response text doesnt match to regex pattern', { text })
  }

  return {
    attributes: <MailboxAttribute[]>match[1].split(' ').filter(Boolean),
    delimiter: match[2],
    name: match[3],
    raw: text,
  }
}

class MailboxMap extends Map<string, Mailbox> {
  protected _connection: TenIMAP

  constructor(connection: TenIMAP, entries?: readonly (readonly [ string, ParsedMailbox ])[] | null) {
    // @ts-expect-error TS2769
    super(entries)
    this._connection = connection
  }

  get(key: string): Mailbox | undefined {
    const value = super.get(key) as Mailbox | ParsedMailbox

    if (value instanceof Mailbox) return value

    const mailbox = new Mailbox(this._connection, value)
    super.set(key, mailbox)
    return mailbox
  }

  forEach(callbackfn: (value: Mailbox, key: string, map: Map<string, Mailbox>) => void, thisArg?: any) {
    super.forEach((value, key, map) => {
      let _value = value as Mailbox | ParsedMailbox

      if (_value instanceof Mailbox) return callbackfn.call(thisArg, _value, key, map)

      const mailbox = new Mailbox(this._connection, value)
      super.set(key, mailbox)
      callbackfn.call(thisArg, mailbox, key, map)
    })
  }
}