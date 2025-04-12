import { describe, expect, it } from 'vitest'
import { parseIMAPResponse } from "./parser.js";
import type { IMAPResponseLine, ResponseCode, ResponseStatus } from "../types/index.js";

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

const testMessage = createTestMessage()

describe('IMAP Response result', () => {
  it('Should match tag', () => {
    const result = parseIMAPResponse(testMessage.message)

    expect(result.tag).toMatch(testMessage.tag)
  })

  it('Should match status', () => {
    const result = parseIMAPResponse(testMessage.message)

    expect(result.status).toMatch(testMessage.status)
  })

  it('Should match code', () => {
    const testMessage = createTestMessage({code: 'OVERQUOTA'})
    const result = parseIMAPResponse(testMessage.message)

    expect(result.code).toMatch(testMessage.code)
  })

  it('Should match body', () => {
    const result = parseIMAPResponse(testMessage.message)

    expect(result.body).toMatch(testMessage.body)
  })
})

describe('IMAP Response line', () => {
  it('Should match zero lines', () => {
    const result = parseIMAPResponse(testMessage.message)

    expect(result.response.lines.length).toEqual(0)
  })
  it('Should match one line', () => {
    const testMessage = createTestMessage({code: 'OVERQUOTA', lines: 1})
    const result = parseIMAPResponse(testMessage.message)

    expect.soft(result.response.lines.length).toEqual(1)
    expect.soft(result.response.lines[0].body).toMatch(testMessage.responseLines[0].body)
  })
  it('Should match two lines', () => {
    const testMessage = createTestMessage({code: 'OVERQUOTA', lines: 2})
    const result = parseIMAPResponse(testMessage.message)

    expect.soft(result.response.lines.length).toEqual(2)
    expect.soft(result.response.lines[0].body).toMatch(testMessage.responseLines[0].body)
    expect.soft(result.response.lines[1].body).toMatch(testMessage.responseLines[0].body)
  })
})