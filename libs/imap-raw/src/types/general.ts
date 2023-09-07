import { RepeatablePermutations } from "types";

type DateMonth =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec"

export type IMAPDate = `${number}-${DateMonth}-${number}`

export type DateDayFixed = ` ${number}` | `${number}`

export type Time = `${number}:${number}:${number}`

export type DateTime = `"${DateDayFixed}-${DateMonth}-${number} ${Time}"`

export type NString = string | 'NIL'

export type IMAPString = string | `"${string}"`

export type NoneZeroNumber = `${number}` | '*'

type SequenceRange = `${NoneZeroNumber}:${NoneZeroNumber}`

type _SequenceSet = NoneZeroNumber | SequenceRange

export type SequenceSet = _SequenceSet | RepeatablePermutations<_SequenceSet, ','>