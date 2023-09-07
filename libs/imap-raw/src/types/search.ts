import { IMAPDate, IMAPString, NoneZeroNumber } from "./general.js";
import { Flag } from "./message.js";

type HeaderField =
  | 'trace'
  | 'resent-date'
  | 'resent-from'
  | 'resent-sender'
  | 'resent-to'
  | 'resent-cc'
  | 'resent-bcc'
  | 'resent-msg-id'
  | 'orig-date'
  | 'from'
  | 'sender'
  | 'reply-to'
  | 'to'
  | 'cc'
  | 'bcc'
  | 'message-id'
  | 'in-reply-to'
  | 'references'
  | 'subject'
  | 'comments'
  | 'keywords'
  | 'optional-field'

type _SearchCriteria =
  | 'ALL'
  | 'ANSWERED'
  | `BCC ${IMAPString}`
  | `BEFORE ${IMAPDate}`
  | `BODY ${IMAPString}`
  | `CC ${IMAPString}`
  | 'DELETED'
  | 'DRAFT'
  | 'FLAGGED'
  | `FROM ${IMAPString}`
  | `HEADER ${HeaderField} ${IMAPString}`
  | `KEYWORD ${Flag}`
  | `LARGER ${number}`
  | 'NEW'
  | 'OLD'
  | `ON ${IMAPDate}`
  | 'RECENT'
  | 'SEEN'
  | `SENTBEFORE ${IMAPDate}`
  | `SENTON ${IMAPDate}`
  | `SENTSINCE ${IMAPDate}`
  | `SINCE ${IMAPDate}`
  | `SMALLER ${number}`
  | `SUBJECT ${IMAPString}`
  | `TEXT ${IMAPString}`
  | `TO ${IMAPString}`
  | `UID ${NoneZeroNumber}`
  | 'UNANSWERED'
  | 'UNDELETED'
  | 'UNDRAFT'
  | 'UNFLAGGED'
  | `UNKEYWORD ${HeaderField}`
  | 'UNSEEN'

// NOT and OR to massive for typescript, so here we only restrict number of arguments
export type SearchCriteria = _SearchCriteria | `NOT ${string}` | `OR ${string} ${string}`