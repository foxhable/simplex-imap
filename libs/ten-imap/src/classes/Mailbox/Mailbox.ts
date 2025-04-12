import TenIMAP from '../../main.js'
import { MAILBOX_ATTRIBUTES, MAILBOX_ROLES } from './types.js'
import type { MailboxData, MailboxFlag } from './types.js'
import type {
  MailboxAttribute,
  MailboxMessageCounts,
  MailboxRole,
  SelectMethodConfig,
} from '../../types/index.js'

export class Mailbox {
  protected _connection: TenIMAP

  public name: string
  public uid: number | null = null
  public uidNext: number | null = null
  public delimiter: string | null

  public messageCounts: MailboxMessageCounts | null = null

  public roles: MailboxRole[] = []
  public flags: MailboxFlag[] = []
  public attributes: MailboxAttribute[]

  public isMarked: boolean | null = null
  public isSelectable: boolean = true
  public isExists: boolean = true
  public isNoInferiors: boolean | null = null
  public isHasChildren: boolean | null = null
  public isSubscribed: boolean | null = null
  public isRemote: boolean | null = null

  constructor(connection: TenIMAP, data: MailboxData) {
    this._connection = connection
    this.name = data.name
    this.uid = data.uid || null
    this.uidNext = data.uidNext || null
    this.attributes = data.attributes || []
    this.delimiter = data.delimiter || null
    this.flags = data.flags || []
    this.messageCounts = data.messageCounts || null
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

  public async select(config?: Omit<SelectMethodConfig, 'onlyParse'>) {
    const parse = await this._connection.select(this.name, Object.assign({ onlyParse: true } as const, config))

    this.uid = parse.uid
    this.uidNext = parse.uidNext
    this.messageCounts = parse.messageCounts
    this.flags = parse.flags

    this._connection.selectedMailbox = this

    return this
  }
}