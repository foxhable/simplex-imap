import { describe, expect, test } from '@jest/globals'
import { IMAPResponseLine, parseIMAPResponse } from "./parser.js";
import { ResponseCode, ResponseStatus } from "../types/response.js";

interface TestMessageOptions {
  tag?: string
  status?: ResponseStatus
  code?: ResponseCode
  body?: string
  lines?: number
}

type TestMessage<TOptions extends TestMessageOptions> = TOptions & {
  message: string,
  responseLines: IMAPResponseLine[]
}

const defaultTestOptions = {
  tag: '1',
  status: 'OK',
  body: 'Authentication successful',
  lines: 0,
} satisfies TestMessageOptions

function createTestMessage<TOptions extends TestMessageOptions>(options?: TOptions): TestMessage<TOptions & typeof defaultTestOptions> {
  const _options = Object.assign(defaultTestOptions, options)
  const {tag, status, code} = _options

  const line = '* CAPABILITY IMAP4rev1 ID XLIST UIDPLUS UNSELECT MOVE LIST-STATUS IDLE\r\n'
  return {
    ..._options,
    message: `${line.repeat(_options.lines)}${tag} ${status} ${code ? `[${code}] ` : ''}${_options.body}\r\n`,
    responseLines: [
      {
        tag: '*',
        raw: '* CAPABILITY IMAP4rev1 ID XLIST UIDPLUS UNSELECT MOVE LIST-STATUS IDLE',
        body: 'CAPABILITY IMAP4rev1 ID XLIST UIDPLUS UNSELECT MOVE LIST-STATUS IDLE'
      }
    ]
  }
}

describe('Parser', () => {
  const testMessage = createTestMessage()

  describe('parseIMAPResponse', () => {
    describe('IMAP Response result', () => {
      test('Should match tag', () => {
        const result = parseIMAPResponse(testMessage.message)

        expect(result.tag).toMatch(testMessage.tag)
      })

      test('Should match status', () => {
        const result = parseIMAPResponse(testMessage.message)

        expect(result.status).toMatch(testMessage.status)
      })

      test('Should match code', () => {
        const testMessage = createTestMessage({code: 'OVERQUOTA'})
        const result = parseIMAPResponse(testMessage.message)

        expect(result.code).toMatch(testMessage.code)
      })

      test('Should match body', () => {
        const result = parseIMAPResponse(testMessage.message)

        expect(result.body).toMatch(testMessage.body)
      })
    })

    describe('IMAP Response line', () => {
      test('Should match zero lines', () => {
        const result = parseIMAPResponse(testMessage.message)

        expect(result.response.lines.length).toEqual(0)
        expect(result.response.lines[0]).toBeUndefined()
      })
      test('Should match one line', () => {
        const testMessage = createTestMessage({code: 'OVERQUOTA', lines: 1})
        const result = parseIMAPResponse(testMessage.message)

        expect(result.response.lines.length).toEqual(1)
        expect(result.response.lines[0].body).toMatch(testMessage.responseLines[0].body)
      })
      test('Should match two lines', () => {
        const testMessage = createTestMessage({code: 'OVERQUOTA', lines: 2})
        const result = parseIMAPResponse(testMessage.message)

        expect(result.response.lines.length).toEqual(2)
        expect(result.response.lines[0].body).toMatch(testMessage.responseLines[0].body)
        expect(result.response.lines[1].body).toMatch(testMessage.responseLines[0].body)
      })
    })
  })
})