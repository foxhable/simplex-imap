import { expect, test } from 'vitest'
import { fetchResponseParser } from '@/main/methods/fetch/fetchResponseParser.js'
import type { MessageHeader } from '@/main/classes/Message/types.js'

test('should parse message uid', () => {
  const message = '1 FETCH (UID 4)'
  const parsed = fetchResponseParser(message)
  expect(parsed.uid).toStrictEqual(4)
})

test('should parse message 3 flags', () => {
  const message = '1 FETCH (FLAGS (\\Seen \\Answered SomeCustomFlag $Junk))'
  const parsed = fetchResponseParser(message)
  expect(parsed.flags).toStrictEqual(['\\Seen', '\\Answered', 'SomeCustomFlag', '$Junk'])
})

test('should parse message 1 flags', () => {
  const message = '1 FETCH (FLAGS (\\Seen))'
  const parsed = fetchResponseParser(message)
  expect(parsed.flags).toStrictEqual(['\\Seen'])
})

test('should parse message zero flags', () => {
  const message = '1 FETCH (FLAGS ())'
  const parsed = fetchResponseParser(message)
  expect(parsed.flags).toStrictEqual([])
})

test('should parse message size', () => {
  const message = '1 FETCH (RFC822.SIZE 6006)'
  const parsed = fetchResponseParser(message)
  expect(parsed.size).toStrictEqual(6006)
})

test('should parse message internaldate', () => {
  const message = '1 FETCH (INTERNALDATE "28-Oct-2024 17:13:08 +0000")'
  const parsed = fetchResponseParser(message)

  const date = new Date('28-Oct-2024 17:13:08 +0000')

  expect(parsed.internalDate).toStrictEqual(date)
})

const headers =
  'Delivered-To:test@test.ru\r\n' +
  'MIME-Version:1.0\r\n' +
  'X-Gm-Message-State: AOJu0Yyk0awttLTBiYJWBr/jqMiq9r9/Q7w6urcgLD11OFNNVm+dsh02\r\n' +
  '\t3640t40/2Pl9K479JA+TS6CuWzUoeOZ7a6PHxrZ6lPPqPSPOmYY48f6Yqu9tOrlYx0FuFAS5Rmy\r\n' +
  '\tm+s4wQoGpneBfrk4K4IIxcb/rs5MAlyVO\r\n' +
  'From:test <test@gmail.com>\r\n' +
  'Date:Mon, 28 Oct 2024 20:12:53 +0300\r\n' +
  'Subject:test\r\n' +
  'To:test@test.ru\r\n' +
  'Content-Type:multipart/alternative; boundary="00000000000002133006258c9558"'

const headersArr: MessageHeader[] = [
  { name: 'Delivered-To', value: 'test@test.ru' },
  { name: 'MIME-Version', value: '1.0' },
  {
    name: 'X-Gm-Message-State',
    value:
      'AOJu0Yyk0awttLTBiYJWBr/jqMiq9r9/Q7w6urcgLD11OFNNVm+dsh02 3640t40/2Pl9K479JA+TS6CuWzUoeOZ7a6PHxrZ6lPPqPSPOmYY48f6Yqu9tOrlYx0FuFAS5Rmy m+s4wQoGpneBfrk4K4IIxcb/rs5MAlyVO',
  },
  { name: 'From', value: 'test <test@gmail.com>' },
  { name: 'Date', value: 'Mon, 28 Oct 2024 20:12:53 +0300' },
  { name: 'Subject', value: 'test' },
  { name: 'To', value: 'test@test.ru' },
  { name: 'Content-Type', value: 'multipart/alternative; boundary="00000000000002133006258c9558"' },
]

test('should parse message headers', () => {
  const message = `1 FETCH (BODY[HEADER] {5428}\r\n${headers}\r\n)`
  const parsed = fetchResponseParser(message)

  expect(parsed.headers.list).toStrictEqual(headersArr)
})

test('should parse message detail headers', () => {
  const message = `1 FETCH (BODY[HEADER] {5428}\r\n${headers}\r\n)`
  const parsed = fetchResponseParser(message)

  expect.soft(parsed.headers.from).toStrictEqual([{ name: 'test', email: 'test@gmail.com' }])
  expect.soft(parsed.headers.to).toStrictEqual([{ name: null, email: 'test@test.ru' }])
  expect.soft(parsed.headers.subject).toStrictEqual('test')
  expect.soft(parsed.headers.date).toStrictEqual(new Date('Mon, 28 Oct 2024 20:12:53 +0300'))
  expect.soft(parsed.headers.messageId).toBeNull()
  expect.soft(parsed.headers.contentType).toStrictEqual({
    type: 'multipart/alternative',
    boundary: '00000000000002133006258c9558',
  })
  expect(parsed.headers.mimeVersion).toStrictEqual('1.0')
})

test('should parse message envelope', () => {
  const message = `1 FETCH (ENVELOPE ("Mon, 28 Oct 2024 17:13:08 +0000" "test" (("Some Name" NIL "test-name" "gmail.com")) NIL NIL (("" NIL "test" "test.ru")) NIL NIL NIL "<some-id@mail.gmail.com>"))`
  const parsed = fetchResponseParser(message)

  expect.soft(parsed.envelope.date).toStrictEqual(new Date('Mon, 28 Oct 2024 17:13:08 +0000'))
  expect.soft(parsed.envelope.subject).toStrictEqual('test')
  expect.soft(parsed.envelope.from).toStrictEqual([{ name: 'Some Name', email: 'test-name@gmail.com' }])
  expect.soft(parsed.envelope.sender).toBeNull()
  expect.soft(parsed.envelope.replyTo).toBeNull()
  expect.soft(parsed.envelope.to).toStrictEqual([{ name: null, email: 'test@test.ru' }])
  expect.soft(parsed.envelope.cc).toBeNull()
  expect.soft(parsed.envelope.bcc).toBeNull()
  expect.soft(parsed.envelope.inReplyTo).toBeNull()
  expect(parsed.envelope.messageId).toStrictEqual('some-id@mail.gmail.com')
})

test('should parse body section', () => {
  const message = '1 FETCH (BODY[1] {14}\r\nsome message\r\n)'
  const parsed = fetchResponseParser(message)

  expect(parsed.body?.[0].section).toStrictEqual(1)
  expect(parsed.body?.[0].text).toStrictEqual('some message')
})

test('should parse full body message', () => {
  const message =
    '1 FETCH (BODY[] {5668}\r\n' +
    `${headers}\r\n` +
    '\r\n' +
    '--00000000000002133006258c9558\r\n' +
    'Content-Type: text/plain; charset="UTF-8"\r\n' +
    '\r\n' +
    'some message\r\n' +
    '\r\n' +
    '--00000000000002133006258c9558\r\n' +
    'Content-Type: text/html; charset="UTF-8"\r\n' +
    '\r\n' +
    '<div dir="ltr">some message</div>\r\n' +
    '\r\n' +
    '--00000000000002133006258c9558\r\n' +
    ')'
  const parsed = fetchResponseParser(message)

  expect.soft(parsed.headers.list).toStrictEqual(headersArr)

  expect.soft(parsed.headers.from).toStrictEqual([{ name: 'test', email: 'test@gmail.com' }])
  expect.soft(parsed.headers.to).toStrictEqual([{ name: null, email: 'test@test.ru' }])
  expect.soft(parsed.headers.subject).toStrictEqual('test')
  expect.soft(parsed.headers.date).toStrictEqual(new Date('Mon, 28 Oct 2024 20:12:53 +0300'))
  expect.soft(parsed.headers.messageId).toBeNull()
  expect.soft(parsed.headers.contentType).toStrictEqual({
    type: 'multipart/alternative',
    boundary: '00000000000002133006258c9558',
  })
  expect.soft(parsed.headers.mimeVersion).toStrictEqual('1.0')

  expect.soft(parsed.body?.[0].text).toStrictEqual('some message')
  expect.soft(parsed.body?.[0].section).toStrictEqual(1)
  expect.soft(parsed.body?.[0].contentType).toStrictEqual('text/plain')
  expect.soft(parsed.body?.[0].charset).toStrictEqual('UTF-8')
  expect.soft(parsed.body?.[0].encoding).toBeNull()

  expect.soft(parsed.body?.[1].text).toStrictEqual('<div dir="ltr">some message</div>')
  expect.soft(parsed.body?.[1].section).toStrictEqual(2)
  expect.soft(parsed.body?.[1].contentType).toStrictEqual('text/html')
  expect.soft(parsed.body?.[1].charset).toStrictEqual('UTF-8')
  expect(parsed.body?.[1].encoding).toBeNull()
})

test('should parse mime responses', () => {
  const message = '1 FETCH (BODY[1.MIME] {45}\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n)'
  const parsed = fetchResponseParser(message)

  expect.soft(parsed.body?.[0].section).toStrictEqual(1)
  expect.soft(parsed.body?.[0].contentType).toStrictEqual('text/plain')
  expect.soft(parsed.body?.[0].charset).toStrictEqual('UTF-8')
})

test('should parse headers of 2 section', () => {
  const message = '1 FETCH (BODY[2.HEADER] {45}\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n)'
  const parsed = fetchResponseParser(message)

  expect.soft(parsed.body?.[0].section).toStrictEqual(2)
  expect.soft(parsed.body?.[0].contentType).toStrictEqual('text/plain')
  expect.soft(parsed.body?.[0].charset).toStrictEqual('UTF-8')
})

test('should parse few mime responses', () => {
  const message =
    '1 FETCH (BODY[2.MIME] {44}\r\n' +
    'Content-Type: text/html; charset="UTF-8"\r\n' +
    '\r\n' +
    ' BODY[1.MIME] {45}\\r\\n' +
    'Content-Type: text/plain; charset="UTF-8"\r\n' +
    '\r\n' +
    ')'
  const parsed = fetchResponseParser(message)

  expect.soft(parsed.body?.[0].section).toStrictEqual(2)
  expect.soft(parsed.body?.[0].contentType).toStrictEqual('text/html')
  expect.soft(parsed.body?.[0].charset).toStrictEqual('UTF-8')

  expect.soft(parsed.body?.[1].section).toStrictEqual(1)
  expect.soft(parsed.body?.[1].contentType).toStrictEqual('text/plain')
  expect.soft(parsed.body?.[1].charset).toStrictEqual('UTF-8')
})

test('should parse few mime responses and header of 2 section', () => {
  const message =
    '1 FETCH (BODY[2.MIME] {44}\r\n' +
    'Content-Type: text/html; charset="UTF-8"\r\n' +
    '\r\n' +
    ' BODY[2.HEADER] {45}\\r\\n' +
    'Content-Type: text/html; charset="UTF-8"\r\n' +
    '\r\n' +
    ' BODY[1.MIME] {45}\\r\\n' +
    'Content-Type: text/plain; charset="UTF-8"\r\n' +
    '\r\n' +
    ')'
  const parsed = fetchResponseParser(message)

  expect.soft(parsed.body?.[0].section).toStrictEqual(2)
  expect.soft(parsed.body?.[0].contentType).toStrictEqual('text/html')
  expect.soft(parsed.body?.[0].charset).toStrictEqual('UTF-8')

  expect.soft(parsed.body?.[1].section).toStrictEqual(1)
  expect.soft(parsed.body?.[1].contentType).toStrictEqual('text/plain')
  expect.soft(parsed.body?.[1].charset).toStrictEqual('UTF-8')
})

test('should parse ALL macro', () => {
  const message =
    '1 FETCH (FLAGS (\\Seen) INTERNALDATE "28-Oct-2024 17:13:08 +0000" RFC822.SIZE 6006 ENVELOPE ("Mon, 28 Oct 2024 17:13:08 +0000" "test" (("foxhable" NIL "foxhable" "gmail.com")) NIL NIL (("" NIL "test" "tenvolve.ru")) NIL NIL NIL "<CACOgkFFDw7oYp-qMURqnJgzq_AKf2onre1kwzpJk5TYRfVSkkw@mail.gmail.com>"))'
  const parsed = fetchResponseParser(message)

  expect.soft(parsed.flags).toStrictEqual(['\\Seen'])
  expect.soft(parsed.internalDate).toStrictEqual(new Date('28-Oct-2024 17:13:08 +0000'))
  expect.soft(parsed.size).toStrictEqual(6006)
})

test('should parse FULL macro', () => {
  const message =
    '1 FETCH (FLAGS (\\Seen) INTERNALDATE "28-Oct-2024 17:13:08 +0000" RFC822.SIZE 6006 ENVELOPE ("Mon, 28 Oct 2024 17:13:08 +0000" "test" (("foxhable" NIL "foxhable" "gmail.com")) NIL NIL (("" NIL "test" "tenvolve.ru")) NIL NIL NIL "<CACOgkFFDw7oYp-qMURqnJgzq_AKf2onre1kwzpJk5TYRfVSkkw@mail.gmail.com>") BODY (("text" "plain" ("charset" "utf-8") NIL NIL "7bit" 13 0)("text" "html" ("charset" "utf-8") NIL NIL "7bit" 34 0) "alternative"))'
  const parsed = fetchResponseParser(message)

  expect.soft(parsed.flags).toStrictEqual(['\\Seen'])
  expect.soft(parsed.internalDate).toStrictEqual(new Date('28-Oct-2024 17:13:08 +0000'))
  expect.soft(parsed.size).toStrictEqual(6006)

  expect.soft(parsed.body?.[0].section).toStrictEqual(1)
  expect.soft(parsed.body?.[0].charset).toStrictEqual('utf-8')
  expect.soft(parsed.body?.[0].contentType).toStrictEqual('text/plain')

  expect.soft(parsed.body?.[1].section).toStrictEqual(2)
  expect.soft(parsed.body?.[1].charset).toStrictEqual('utf-8')
  expect.soft(parsed.body?.[1].contentType).toStrictEqual('text/html')
})

test('should parse FAST macro', () => {
  const message = '1 FETCH (FLAGS (\\Seen) INTERNALDATE "28-Oct-2024 17:13:08 +0000" RFC822.SIZE 6006)'
  const parsed = fetchResponseParser(message)

  expect.soft(parsed.flags).toStrictEqual(['\\Seen'])
  expect.soft(parsed.internalDate).toStrictEqual(new Date('28-Oct-2024 17:13:08 +0000'))
  expect.soft(parsed.size).toStrictEqual(6006)
})

test('should parse different options in one time', () => {
  const message =
    '1 FETCH (UID 4 FLAGS (\\Seen) RFC822.SIZE 6006 INTERNALDATE "28-Oct-2024 17:13:08 +0000" BODYSTRUCTURE (("text" "plain" ("charset" "utf-8") NIL NIL "7bit" 13 0 NIL NIL NIL NIL)("text" "html" ("charset" "utf-8") NIL NIL "7bit" 34 0 NIL NIL NIL NIL) "alternative" ("boundary" NIL)) BODY[2.MIME] {44}\r\n' +
    'Content-Type: text/html; charset="UTF-8"\r\n\r\n)'
  const parsed = fetchResponseParser(message)

  expect.soft(parsed.uid).toStrictEqual(4)
  expect.soft(parsed.flags).toStrictEqual(['\\Seen'])
  expect.soft(parsed.internalDate).toStrictEqual(new Date('28-Oct-2024 17:13:08 +0000'))
  expect.soft(parsed.size).toStrictEqual(6006)

  expect.soft(parsed.body?.[0].section).toStrictEqual(1)
  expect.soft(parsed.body?.[0].charset).toStrictEqual('utf-8')
  expect.soft(parsed.body?.[0].contentType).toStrictEqual('text/plain')

  expect.soft(parsed.body?.[1].section).toStrictEqual(2)
  expect.soft(parsed.body?.[1].charset).toStrictEqual('utf-8')
  expect.soft(parsed.body?.[1].contentType).toStrictEqual('text/html')
})
