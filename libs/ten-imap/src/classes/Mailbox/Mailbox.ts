import TenIMAP from '../../main.js'
import { MAILBOX_ATTRIBUTES, MAILBOX_ROLES } from './types.js'
import type {
  MailboxAttribute,
  MailboxRole,
  MailboxData,
} from './types.js'

export class Mailbox {
  protected _connection: TenIMAP

  public attributes: MailboxAttribute[]
  public name: string
  public delimiter: string | null

  public isMarked: boolean | null = null
  public isSelectable: boolean = true
  public isExists: boolean = true
  public isNoInferiors: boolean | null = null
  public isHasChildren: boolean | null = null
  public isSubscribed: boolean | null = null
  public isRemote: boolean | null = null

  public roles: MailboxRole[] = []

  constructor(connection: TenIMAP, data: MailboxData) {
    this._connection = connection
    this.name = data.name
    this.attributes = data.attributes || []
    this.delimiter = data.delimiter || null
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