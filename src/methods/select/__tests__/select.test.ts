import { test, expect } from 'vitest'
import { parseSelectResponse } from '../lib/parseSelectResponse.js'

function line(body: string) {
  return { tag: '*', body: body, raw: `* ${body}` }
}

test('Should parse 3 exists messages', () => {
  const lines = [line('3 EXISTS')]
  const parsed = parseSelectResponse(lines)
  expect(parsed.messageCounts.exists).toBe(3)
})

test('Should parse 6 recent messages', () => {
  const lines = [line('6 RECENT')]
  const parsed = parseSelectResponse(lines)
  expect(parsed.messageCounts.recent).toBe(6)
})

test('Should parse 10 UNSEEN messages', () => {
  const lines = [line('OK [UNSEEN 10]')]
  const parsed = parseSelectResponse(lines)
  expect(parsed.messageCounts.unseen).toBe(10)
})

test('Should parse flags', () => {
  const lines = [line('FLAGS (\\Answered \\Flagged \\Deleted \\Draft \\Seen)')]
  const parsed = parseSelectResponse(lines)
  expect(parsed.flags).toStrictEqual(['\\Answered', '\\Flagged', '\\Deleted', '\\Draft', '\\Seen'])
})

test('Should parse permanent flags', () => {
  const lines = [line('OK [PERMANENTFLAGS (\\Answered \\Flagged \\Deleted \\Seen \\Draft)]')]
  const parsed = parseSelectResponse(lines)
  expect(parsed.permanentFlags).toStrictEqual(['\\Answered', '\\Flagged', '\\Deleted', '\\Seen', '\\Draft'])
})

test('Should parse uid', () => {
  const lines = [line('OK [UIDVALIDITY 1727621179]')]
  const parsed = parseSelectResponse(lines)
  expect(parsed.uid).toBe(1727621179)
})

test('Should parse next uid', () => {
  const lines = [line('OK [UIDNEXT 4]')]
  const parsed = parseSelectResponse(lines)
  expect(parsed.uidNext).toBe(4)
})
