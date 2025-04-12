import { expect, test } from 'vitest'
import { parseIMAPResponse } from './parser.js'

test('Should match tag', () => {
  const message = '1 OK Authentication successful\r\n'
  const result = parseIMAPResponse(message)

  expect(result.tag).toStrictEqual('1')
})

test('Should match status', () => {
  const message = '1 OK Authentication successful\r\n'
  const result = parseIMAPResponse(message)

  expect(result.status).toStrictEqual('OK')
})

test('Should match code', () => {
  const message = '1 OK [OVERQUOTA] Authentication successful\r\n'
  const result = parseIMAPResponse(message)

  expect(result.code).toStrictEqual('OVERQUOTA')
})

test('Should match body', () => {
  const message = '1 OK [OVERQUOTA] Authentication successful\r\n'
  const result = parseIMAPResponse(message)

  expect(result.body).toStrictEqual('Authentication successful')
})

test('Should match zero lines', () => {
  const message = '1 OK [OVERQUOTA] Authentication successful\r\n'
  const result = parseIMAPResponse(message)

  expect(result.response.lines.length).toEqual(0)
})

test('Should match one line', () => {
  const message = '* 2 EXISTS\r\n1 OK [OVERQUOTA] Authentication successful\r\n'
  const result = parseIMAPResponse(message)

  expect.soft(result.response.lines.length).toEqual(1)
  expect.soft(result.response.lines[0].body).toStrictEqual('2 EXISTS')
})

test('Should match two lines', () => {
  const message = [
    '* FLAGS (\\Answered \\Flagged \\Deleted \\Draft \\Seen)\r\n',
    '* 2 EXISTS\r\n',
    '1 OK [OVERQUOTA] Authentication successful\r\n',
  ].join('')

  const result = parseIMAPResponse(message)

  expect.soft(result.response.lines.length).toEqual(2)
  expect.soft(result.response.lines[0].body).toStrictEqual('FLAGS (\\Answered \\Flagged \\Deleted \\Draft \\Seen)')
  expect.soft(result.response.lines[1].body).toStrictEqual('2 EXISTS')
})
