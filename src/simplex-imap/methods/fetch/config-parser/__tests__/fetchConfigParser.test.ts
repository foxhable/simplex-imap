import { expect, test } from 'vitest'
import { parseFetchConfig } from '@/simplex-imap/methods/fetch/config-parser/fetchConfigParser.js'

const FETCH_ITEM_REGEX_PART = '[\\w.]+(?:\\[[\\w(). ]+\\](?:<[\\d.]+>)?)?'
const FETCH_ITEM_REGEX = new RegExp(FETCH_ITEM_REGEX_PART, 'g')
const FETCH_CRITERIA_REGEX = new RegExp(`\\((${FETCH_ITEM_REGEX_PART}(?: ${FETCH_ITEM_REGEX_PART})*)\\)`)

function extractItemsFromString(str: string): string[] {
  const match = str.match(FETCH_CRITERIA_REGEX)
  if (!match || !match[1]) return []

  return [...match[1].matchAll(FETCH_ITEM_REGEX)].map((i) => i[0].toString())
}

test('should create config with macro FULL by raw parameter', () => {
  const result = parseFetchConfig({ raw: 'FULL' })
  expect(result).toStrictEqual('FULL')
})

test('should create config with macro FULL', () => {
  const result = parseFetchConfig('FULL')
  expect(result).toStrictEqual('FULL')
})

test('should create config with macro FAST', () => {
  const result = parseFetchConfig('FAST')
  expect(result).toStrictEqual('FAST')
})

test('should create config with macro ALL', () => {
  const result = parseFetchConfig('ALL')
  expect(result).toStrictEqual('ALL')
})

test('should create config with UID', () => {
  const result = parseFetchConfig({ uid: true })
  expect(result).toStrictEqual('UID')
})

test('should create config with FLAGS', () => {
  const result = parseFetchConfig({ flags: true })
  expect(result).toStrictEqual('FLAGS')
})

test('should create config with RFC822.SIZE', () => {
  const result = parseFetchConfig({ size: true })
  expect(result).toStrictEqual('RFC822.SIZE')
})

test('should create config with INTERNALDATE', () => {
  const result = parseFetchConfig({ internaldate: true })
  expect(result).toStrictEqual('INTERNALDATE')
})

test('should create config with ENVELOPE', () => {
  const result = parseFetchConfig({ envelope: true })
  expect(result).toStrictEqual('ENVELOPE')
})

test('should create config with BODYSTRUCTURE', () => {
  const result = parseFetchConfig({ bodyStructure: true })
  expect(result).toStrictEqual('BODYSTRUCTURE')
})

test('should create config with BODY[]', () => {
  const result = parseFetchConfig({ body: true })
  expect(result).toStrictEqual('BODY[]')
})

test('should create config with BODY[HEADER]', () => {
  const result = parseFetchConfig({ bodyHeader: true })
  expect(result).toStrictEqual('BODY[HEADER]')
})

test('should create config with BODY[TEXT]', () => {
  const result = parseFetchConfig({ bodyText: true })
  expect(result).toStrictEqual('BODY[TEXT]')
})

test('should create config with BODY[1.MIME]', () => {
  const result = parseFetchConfig({
    bodyMime: { sectionPart: 1 },
  })
  expect(result).toStrictEqual('BODY[1.MIME]')
})

test('should create config with BODY[HEADER.FIELDS (Bcc From)]', () => {
  const result = parseFetchConfig({
    bodyHeaderFields: {
      fieldNames: ['Bcc', 'From'],
    },
  })
  expect(result).toStrictEqual('BODY[HEADER.FIELDS (Bcc From)]')
})

test('should create config with BODY[HEADER.FIELDS (Sender)]', () => {
  const result = parseFetchConfig({
    bodyHeaderFields: { fieldNames: ['Sender'] },
  })
  expect(result).toStrictEqual('BODY[HEADER.FIELDS (Sender)]')
})

test('should create config with BODY[HEADER.FIELDS.NOT (Sender)]', () => {
  const result = parseFetchConfig({
    bodyHeaderFields: {
      fieldNames: ['Sender'],
      not: true,
    },
  })
  expect(result).toStrictEqual('BODY[HEADER.FIELDS.NOT (Sender)]')
})

test('should create config with BODY[HEADER.FIELDS.NOT (Sender Cc)]', () => {
  const result = parseFetchConfig({
    bodyHeaderFields: {
      fieldNames: ['Sender', 'Cc'],
      not: true,
    },
  })
  expect(result).toStrictEqual('BODY[HEADER.FIELDS.NOT (Sender Cc)]')
})

test('should create config with BODY[1.HEADER.FIELDS.NOT (Sender Cc)]', () => {
  const result = parseFetchConfig({
    bodyHeaderFields: {
      sectionPart: 1,
      fieldNames: ['Sender', 'Cc'],
      not: true,
    },
  })
  expect(result).toStrictEqual('BODY[1.HEADER.FIELDS.NOT (Sender Cc)]')
})

test('should create config with BODY[1.HEADER.FIELDS.NOT (Sender Cc)]<0.105>', () => {
  const result = parseFetchConfig({
    bodyHeaderFields: {
      sectionPart: 1,
      fieldNames: ['Sender', 'Cc'],
      not: true,
      partial: [0, 105],
    },
  })
  expect(result).toStrictEqual('BODY[1.HEADER.FIELDS.NOT (Sender Cc)]<0.105>')
})

test('should create config with BODY[1.HEADER.FIELDS (Sender Cc)]<0.105>', () => {
  const result = parseFetchConfig({
    bodyHeaderFields: {
      sectionPart: 1,
      fieldNames: ['Sender', 'Cc'],
      not: false,
      partial: [0, 105],
    },
  })
  expect(result).toStrictEqual('BODY[1.HEADER.FIELDS (Sender Cc)]<0.105>')
})

test('should create config with BODY[]<0.199>', () => {
  const result = parseFetchConfig({
    body: { partial: [0, 199] },
  })
  expect(result).toStrictEqual('BODY[]<0.199>')
})

test('should create config with BODY[2]', () => {
  const result = parseFetchConfig({
    body: { sectionPart: 2 },
  })
  expect(result).toStrictEqual('BODY[2]')
})

test('should create config with BODY[2]<0> via single number', () => {
  const result = parseFetchConfig({
    body: { sectionPart: 2, partial: 0 },
  })
  expect(result).toStrictEqual('BODY[2]<0>')
})

test('should create config with BODY[2]<0> via object', () => {
  const result = parseFetchConfig({
    body: { sectionPart: 2, partial: { from: 0 } },
  })
  expect(result).toStrictEqual('BODY[2]<0>')
})

test('should create config with BODY[2]<50.500> via object', () => {
  const result = parseFetchConfig({
    body: { sectionPart: 2, partial: { from: 50, to: 500 } },
  })
  expect(result).toStrictEqual('BODY[2]<50.500>')
})

test('should create config with BODY[1.3.TEXT]<0.199>', () => {
  const result = parseFetchConfig({
    bodyText: { sectionPart: '1.3', partial: [0, 199] },
  })
  expect(result).toStrictEqual('BODY[1.3.TEXT]<0.199>')
})

test('should create config with BODY[2.HEADER]<0.299>', () => {
  const result = parseFetchConfig({
    bodyHeader: { sectionPart: 2, partial: [0, 299] },
  })
  expect(result).toStrictEqual('BODY[2.HEADER]<0.299>')
})

test('should create config with BODY[2.MIME]<0.499>', () => {
  const result = parseFetchConfig({
    bodyMime: { sectionPart: 2, partial: [0, 499] },
  })
  expect(result).toStrictEqual('BODY[2.MIME]<0.499>')
})

test('should create config with (FLAGS UID)', () => {
  const result = parseFetchConfig({
    flags: true,
    uid: true,
  })
  const items = extractItemsFromString(result)
  expect.soft(items.length).toStrictEqual(2)
  expect.soft(items.includes('UID')).toBeTruthy()
  expect(items.includes('FLAGS')).toBeTruthy()
})

test('should create config with (FLAGS BODY[2.HEADER]<0.299>)', () => {
  const result = parseFetchConfig({
    flags: true,
    bodyHeader: { sectionPart: 2, partial: [0, 299] },
  })
  const items = extractItemsFromString(result)
  expect.soft(items.length).toStrictEqual(2)
  expect.soft(items.includes('BODY[2.HEADER]<0.299>')).toBeTruthy()
  expect(items.includes('FLAGS')).toBeTruthy()
})

test('should create config with (FLAGS BODY[2.HEADER] BODY[2.HEADER.FIELDS (Sender Cc)])', () => {
  const result = parseFetchConfig({
    flags: true,
    bodyHeader: { sectionPart: 2 },
    bodyHeaderFields: { sectionPart: 2, fieldNames: ['Sender', 'Cc'] },
  })
  const items = extractItemsFromString(result)
  expect.soft(items.length).toStrictEqual(3)
  expect.soft(items.includes('BODY[2.HEADER]')).toBeTruthy()
  expect.soft(items.includes('BODY[2.HEADER.FIELDS (Sender Cc)]')).toBeTruthy()
  expect(items.includes('FLAGS')).toBeTruthy()
})

test('should create config with (BODY[2.TEXT] BODY[1.TEXT])', () => {
  const result = parseFetchConfig([{ bodyText: { sectionPart: 2 } }, { bodyText: { sectionPart: 1 } }])
  const items = extractItemsFromString(result)
  expect.soft(items.length).toStrictEqual(2)
  expect.soft(items.includes('BODY[2.TEXT]')).toBeTruthy()
  expect(items.includes('BODY[1.TEXT]')).toBeTruthy()
})

test('should create config with (FLAGS BODY[2.TEXT] BODY[1.TEXT])', () => {
  const result = parseFetchConfig([{ bodyText: { sectionPart: 2 }, flags: true }, { bodyText: { sectionPart: 1 } }])
  const items = extractItemsFromString(result)
  expect.soft(items.length).toStrictEqual(3)
  expect.soft(items.includes('BODY[2.TEXT]')).toBeTruthy()
  expect.soft(items.includes('BODY[1.TEXT]')).toBeTruthy()
  expect(items.includes('FLAGS')).toBeTruthy()
})

test('should create config with FLAGS', () => {
  const result = parseFetchConfig([{ flags: true }, { flags: true }])
  expect(result).toStrictEqual('FLAGS')
})

test('should create config with (FLAGS BODY[2.TEXT])', () => {
  const result = parseFetchConfig([{ flags: true, bodyText: { sectionPart: 2 } }, { flags: true }])
  const items = extractItemsFromString(result)
  expect.soft(items.length).toStrictEqual(2)
  expect.soft(items.includes('BODY[2.TEXT]')).toBeTruthy()
  expect(items.includes('FLAGS')).toBeTruthy()
})
