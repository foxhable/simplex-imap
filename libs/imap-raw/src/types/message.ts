import { Permutations } from "types";
import { DateTime, NoneZeroNumber, NString } from "./general.js";

export type Flag =
  | "\\Answered"
  | "\\Flagged"
  | "\\Deleted"
  | "\\Seen"
  | "\\Draft"
  | "flag-keyword"
  | "flag-extension"

export type FlagFetch = Flag | '\\Recent'

export type StatusData = 'MESSAGES' | 'RECENT' | 'UIDNEXT' | 'UNSEEN'

export type StatusDataArg = `(${Permutations<StatusData>})`

type Address = `(${NString} ${NString} ${NString} ${NString})`

type EnvAddress = `(${Address})` | 'NIL'

type Envelope = `(${NString} ${NString} ${EnvAddress} ${EnvAddress} ${EnvAddress} ${EnvAddress} ${EnvAddress} ${EnvAddress} ${NString} ${NString})`

type BodyTypeBasic = ''
type BodyType1Part = ''
type Body = `()`

type MsgAttDynamic = `FLAGS (${`${FlagFetch}${string}` | ''})`
type MsgAttStatic =
  `ENVELOPE ${Envelope}`
  | `INTERNALDATE ${DateTime}`
  | `RFC822${' .HEADER ' | ' .TEXT ' | ' '}${NString}`
  | `RFC822.SIZE ${number}`
  | `BODY${' STRUCTURE ' | ' '}`

type MsgAtt = `(${MsgAttDynamic | MsgAttStatic}${string})`

export type MessageData = `${NoneZeroNumber} ${'EXPUNGE' | `FETCH ${MsgAtt}`}`