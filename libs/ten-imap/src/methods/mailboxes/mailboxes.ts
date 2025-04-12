import type TenIMAP from '../../main.js'
import type { MailboxAttribute, MailboxRole, ParsedMailbox } from './types.js'
import { MAILBOX_ATTRIBUTES, MAILBOX_ROLES } from './types.js'
import { TenIMAPError } from '../../general/error.js'

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

export class Mailbox {
  protected _connection: TenIMAP

  public attributes: MailboxAttribute[]
  public name: string
  public delimiter: string
  public raw: string

  public isMarked: boolean | null = null
  public isSelectable: boolean = true
  public isExists: boolean = true
  public isNoInferiors: boolean | null = null
  public isHasChildren: boolean | null = null
  public isSubscribed: boolean | null = null
  public isRemote: boolean | null = null

  public roles: MailboxRole[] = []

  constructor(connection: TenIMAP, data: ParsedMailbox) {
    this._connection = connection
    this.attributes = data.attributes
    this.name = data.name
    this.delimiter = data.delimiter
    this.raw = data.raw
    this._setPropsByAttributes()
  }

  protected _setPropsByAttributes() {
    this.attributes.forEach(attribute => {
      switch (attribute) {
        case MAILBOX_ATTRIBUTES.MARKED:
          this.isMarked = true
          break
        case MAILBOX_ATTRIBUTES.UNMARKED:
          this.isMarked = false
          break
        case MAILBOX_ATTRIBUTES.NON_EXISTENT:
          this.isExists = false
          this.isSelectable = false
          break
        case MAILBOX_ATTRIBUTES.NOSELECT:
          this.isSelectable = false
          break
        case MAILBOX_ATTRIBUTES.NO_INFERIORS:
          this.isNoInferiors = true
          this.isHasChildren = false
          break
        case MAILBOX_ATTRIBUTES.HAS_CHILDREN:
          this.isHasChildren = true
          break
        case MAILBOX_ATTRIBUTES.HAS_NO_CHILDREN:
          this.isHasChildren = false
          break
        case MAILBOX_ATTRIBUTES.SUBSCRIBED:
          this.isSubscribed = true
          break
        case MAILBOX_ATTRIBUTES.REMOTE:
          this.isRemote = true
          break
        case MAILBOX_ATTRIBUTES.INBOX:
          this.roles.push(MAILBOX_ROLES.INBOX)
          break
        case MAILBOX_ATTRIBUTES.SPAM:
        case MAILBOX_ATTRIBUTES.JUNK:
          this.roles.push(MAILBOX_ROLES.JUNK)
          break
        case MAILBOX_ATTRIBUTES.ALL:
          this.roles.push(MAILBOX_ROLES.ALL)
          break
        case MAILBOX_ATTRIBUTES.ARCHIVE:
          this.roles.push(MAILBOX_ROLES.ARCHIVE)
          break
        case MAILBOX_ATTRIBUTES.DRAFTS:
          this.roles.push(MAILBOX_ROLES.DRAFTS)
          break
        case MAILBOX_ATTRIBUTES.FLAGGED:
          this.roles.push(MAILBOX_ROLES.FLAGGED)
          break
        case MAILBOX_ATTRIBUTES.SENT:
          this.roles.push(MAILBOX_ROLES.SENT)
          break
        case MAILBOX_ATTRIBUTES.TRASH:
          this.roles.push(MAILBOX_ROLES.TRASH)
          break
      }
    })
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