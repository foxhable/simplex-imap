import { parseMailbox } from '@/simplex-imap/methods/mailboxes/lib/parseMailbox.js'
import { test, expect } from 'vitest'
import { type MailboxAttribute } from '@/simplex-imap/classes/Mailbox/types.js'

function createMailboxLine(name: string, attributes: MailboxAttribute[] = [], delimiter: string = '/') {
  return `LIST (${attributes.join(' ')}) "${delimiter}" "${name}"`
}

test('Should parse "Inbox" name with attribute', () => {
  const mailboxName = 'Inbox'
  const rawLine = createMailboxLine(mailboxName, ['\\Inbox'])
  const parsed = parseMailbox(rawLine)

  expect(parsed.attributes).toStrictEqual(['\\Inbox'])
  expect(parsed.name).toBe(mailboxName)
  expect(parsed.delimiter).toBe('/')
  expect(parsed.raw).toBe(`LIST (\\Inbox) "/" "Inbox"`)
})

test('Should parse "mailbox" name without attribute', () => {
  const rawLine = createMailboxLine('mailbox')
  const parsed = parseMailbox(rawLine)

  expect(parsed.attributes).toStrictEqual([])
  expect(parsed.name).toBe('mailbox')
  expect(parsed.delimiter).toBe('/')
  expect(parsed.raw).toBe(`LIST () "/" "mailbox"`)
})

test('Should parse "some mailbox" name without attribute', () => {
  const rawLine = createMailboxLine('some mailbox')
  const parsed = parseMailbox(rawLine)

  expect(parsed.attributes).toStrictEqual([])
  expect(parsed.name).toBe('some mailbox')
  expect(parsed.delimiter).toBe('/')
  expect(parsed.raw).toBe(`LIST () "/" "some mailbox"`)
})

test('Should parse nested mailbox name without attribute', () => {
  const rawLine = createMailboxLine('mailbox/nested')
  const parsed = parseMailbox(rawLine)

  expect(parsed.attributes).toStrictEqual([])
  expect(parsed.parentsNames).toStrictEqual(['mailbox'])
  expect(parsed.name).toBe('nested')
  expect(parsed.delimiter).toBe('/')
  expect(parsed.raw).toBe(`LIST () "/" "mailbox/nested"`)
})

test('Should parse nested mailbox name with delimiter "%"', () => {
  const rawLine = createMailboxLine('mailbox%some%nested', [], '%')
  const parsed = parseMailbox(rawLine)

  expect(parsed.attributes).toStrictEqual([])
  expect(parsed.parentsNames).toStrictEqual(['mailbox', 'some'])
  expect(parsed.name).toBe('nested')
  expect(parsed.delimiter).toBe('%')
  expect(parsed.raw).toBe(`LIST () "%" "mailbox%some%nested"`)
})

test('Should parse deep nested mailbox name without attribute', () => {
  const rawLine = createMailboxLine('some/deep deep/nexted/mailbox/with that name')
  const parsed = parseMailbox(rawLine)

  expect(parsed.attributes).toStrictEqual([])
  expect(parsed.parentsNames).toStrictEqual(['some', 'deep deep', 'nexted', 'mailbox'])
  expect(parsed.name).toBe('with that name')
  expect(parsed.delimiter).toBe('/')
  expect(parsed.raw).toBe(`LIST () "/" "some/deep deep/nexted/mailbox/with that name"`)
})

test('Should parse mailbox name with three attributes', () => {
  const rawLine = createMailboxLine('Inbox', ['\\Marked', '\\Subscribed', '\\Inbox'])
  const parsed = parseMailbox(rawLine)

  expect(parsed.attributes).toStrictEqual(['\\Marked', '\\Subscribed', '\\Inbox'])
  expect(parsed.parentsNames).toStrictEqual([])
  expect(parsed.name).toBe('Inbox')
  expect(parsed.delimiter).toBe('/')
  expect(parsed.raw).toBe(`LIST (\\Marked \\Subscribed \\Inbox) "/" "Inbox"`)
})
