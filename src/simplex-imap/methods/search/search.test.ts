import { describe, expect, it } from 'vitest'
import type { SearchFilter } from './types.js'
import { generateSearchFilter, parseSearchResponse } from './search.js'
import { HEADER_FIELDS } from './types.js'
import { convertToIMAPDate } from '@/simplex-imap/general/date/date.js'
import { MAILBOX_FLAGS } from '@/simplex-imap/classes/Mailbox/types.js'

describe('Simple single filters', () => {
  describe('Filter by headers', () => {
    it('Should be set HEADER sender', () => {
      const filter: SearchFilter = {
        headers: { header: [{ field: HEADER_FIELDS.SENDER, value: 'it@example.ru' }] },
      }

      expect(generateSearchFilter(filter)).toBe('HEADER sender it@example.ru')
    })

    it('Should be set HEADER sender and HEADER subject', () => {
      const filter: SearchFilter = {
        headers: {
          header: [
            { field: HEADER_FIELDS.SENDER, value: 'it@example.ru' },
            { field: HEADER_FIELDS.SUBJECT, value: 'it' },
          ],
        },
      }

      expect(generateSearchFilter(filter)).toBe('HEADER sender it@example.ru HEADER subject it')
    })

    it('Should be set one BCC', () => {
      const filter: SearchFilter = {
        headers: { bcc: ['it'] },
      }

      expect(generateSearchFilter(filter)).toBe('BCC "it"')
    })

    it('Should be set two BCC', () => {
      const filter: SearchFilter = {
        headers: { bcc: ['it', 'test1'] },
      }

      expect(generateSearchFilter(filter)).toBe('BCC "it" BCC "test1"')
    })

    it('Should be set one CC', () => {
      const filter: SearchFilter = {
        headers: { cc: ['it'] },
      }

      expect(generateSearchFilter(filter)).toBe('CC "it"')
    })

    it('Should be set two CC', () => {
      const filter: SearchFilter = {
        headers: { cc: ['it', 'test1'] },
      }

      expect(generateSearchFilter(filter)).toBe('CC "it" CC "test1"')
    })

    it('Should be set one FROM', () => {
      const filter: SearchFilter = {
        headers: { from: ['it@example.com'] },
      }

      expect(generateSearchFilter(filter)).toBe('FROM it@example.com')
    })

    it('Should be set two FROM', () => {
      const filter: SearchFilter = {
        headers: { from: ['it@example.com', 'test1@example.com'] },
      }

      expect(generateSearchFilter(filter)).toBe('FROM it@example.com FROM test1@example.com')
    })

    it('Should be set one TO', () => {
      const filter: SearchFilter = {
        headers: { to: ['it@example.com'] },
      }

      expect(generateSearchFilter(filter)).toBe('TO it@example.com')
    })

    it('Should be set two TO', () => {
      const filter: SearchFilter = {
        headers: { to: ['it@example.com', 'test1@example.com'] },
      }

      expect(generateSearchFilter(filter)).toBe('TO it@example.com TO test1@example.com')
    })
  })

  describe('Filter by dates', () => {
    it('Should be set one ON date', () => {
      const date = new Date()
      const filter: SearchFilter = {
        date: { on: [date] },
      }

      expect(generateSearchFilter(filter)).toBe(`ON ${convertToIMAPDate(date)}`)
    })

    it('Should be set two ON date', () => {
      const date = new Date()
      const date2 = new Date(date.getTime() + 60 * 60 * 1000)

      const filter: SearchFilter = {
        date: { on: [date, date2] },
      }

      expect(generateSearchFilter(filter)).toBe(`ON ${convertToIMAPDate(date)} ON ${convertToIMAPDate(date2)}`)
    })

    it('Should be set SENTON date', () => {
      const date = new Date()
      const filter: SearchFilter = {
        date: { sentOn: [date] },
      }

      expect(generateSearchFilter(filter)).toBe(`SENTON ${convertToIMAPDate(date)}`)
    })

    it('Should be set SINCE date', () => {
      const date = new Date()
      const filter: SearchFilter = {
        date: { since: [date] },
      }

      expect(generateSearchFilter(filter)).toBe(`SINCE ${convertToIMAPDate(date)}`)
    })

    it('Should be set SENTSINCE date', () => {
      const date = new Date()
      const filter: SearchFilter = {
        date: { sentSince: [date] },
      }

      expect(generateSearchFilter(filter)).toBe(`SENTSINCE ${convertToIMAPDate(date)}`)
    })

    it('Should be set BEFORE date', () => {
      const date = new Date()
      const filter: SearchFilter = {
        date: { before: [date] },
      }

      expect(generateSearchFilter(filter)).toBe(`BEFORE ${convertToIMAPDate(date)}`)
    })

    it('Should be set SENTBEFORE date', () => {
      const date = new Date()
      const filter: SearchFilter = {
        date: { sentBefore: [date] },
      }

      expect(generateSearchFilter(filter)).toBe(`SENTBEFORE ${convertToIMAPDate(date)}`)
    })
  })

  describe('Filter by content', () => {
    it('Should be set SUBJECT', () => {
      const filter: SearchFilter = {
        content: { subject: ['it'] },
      }

      expect(generateSearchFilter(filter)).toBe(`SUBJECT "it"`)
    })

    it('Should be set BODY', () => {
      const filter: SearchFilter = {
        content: { body: ['it'] },
      }

      expect(generateSearchFilter(filter)).toBe(`BODY "it"`)
    })

    it('Should be set TEXT', () => {
      const filter: SearchFilter = {
        content: { text: ['it'] },
      }

      expect(generateSearchFilter(filter)).toBe(`TEXT "it"`)
    })
  })

  describe('Filter by props', () => {
    it('Should be set UID', () => {
      const filter: SearchFilter = {
        props: { uid: ['1'] },
      }

      expect(generateSearchFilter(filter)).toBe('UID 1')
    })

    it('Should be set one KEYWORD', () => {
      const filter: SearchFilter = {
        props: { keyword: [MAILBOX_FLAGS.FLAGGED] },
      }

      expect(generateSearchFilter(filter)).toBe(`KEYWORD ${MAILBOX_FLAGS.FLAGGED}`)
    })

    it('Should be set two KEYWORD', () => {
      const filter: SearchFilter = {
        props: { keyword: [MAILBOX_FLAGS.FLAGGED, MAILBOX_FLAGS.DELETED] },
      }

      expect(generateSearchFilter(filter)).toBe(`KEYWORD ${MAILBOX_FLAGS.FLAGGED} KEYWORD ${MAILBOX_FLAGS.DELETED}`)
    })

    it('Should be set UNKEYWORD', () => {
      const filter: SearchFilter = {
        props: { unKeyword: [MAILBOX_FLAGS.FLAGGED] },
      }

      expect(generateSearchFilter(filter)).toBe(`UNKEYWORD ${MAILBOX_FLAGS.FLAGGED}`)
    })

    it('Should be set LARGER', () => {
      const filter: SearchFilter = {
        props: { larger: [200] },
      }

      expect(generateSearchFilter(filter)).toBe(`LARGER 200`)
    })

    it('Should be set SMALLER', () => {
      const filter: SearchFilter = {
        props: { smaller: [200] },
      }

      expect(generateSearchFilter(filter)).toBe(`SMALLER 200`)
    })
  })

  describe('Filter by flags', () => {
    it('Should be ANSWERED', () => {
      const filter: SearchFilter = {
        flags: { answered: true },
      }

      expect(generateSearchFilter(filter)).toBe('ANSWERED')
    })

    it('Should be UNANSWERED', () => {
      const filter: SearchFilter = {
        flags: { answered: false },
      }

      expect(generateSearchFilter(filter)).toBe('UNANSWERED')
    })

    it('Should be DELETED', () => {
      const filter: SearchFilter = {
        flags: { deleted: true },
      }

      expect(generateSearchFilter(filter)).toBe('DELETED')
    })

    it('Should be UNDELETED', () => {
      const filter: SearchFilter = {
        flags: { deleted: false },
      }

      expect(generateSearchFilter(filter)).toBe('UNDELETED')
    })

    it('Should be DRAFT', () => {
      const filter: SearchFilter = {
        flags: { draft: true },
      }

      expect(generateSearchFilter(filter)).toBe('DRAFT')
    })

    it('Should be UNDRAFT', () => {
      const filter: SearchFilter = {
        flags: { draft: false },
      }

      expect(generateSearchFilter(filter)).toBe('UNDRAFT')
    })

    it('Should be SEEN', () => {
      const filter: SearchFilter = {
        flags: { seen: true },
      }

      expect(generateSearchFilter(filter)).toBe('SEEN')
    })

    it('Should be UNSEEN', () => {
      const filter: SearchFilter = {
        flags: { seen: false },
      }

      expect(generateSearchFilter(filter)).toBe('UNSEEN')
    })

    it('Should be FLAGGED', () => {
      const filter: SearchFilter = {
        flags: { flagged: true },
      }

      expect(generateSearchFilter(filter)).toBe('FLAGGED')
    })

    it('Should be UNFLAGGED', () => {
      const filter: SearchFilter = {
        flags: { flagged: false },
      }

      expect(generateSearchFilter(filter)).toBe('UNFLAGGED')
    })
  })
})

describe('Advanced filters', () => {
  it('Should be NOT ANSWERED', () => {
    const filter: SearchFilter = {
      logical: { not: [{ flags: { answered: true } }] },
    }

    expect(generateSearchFilter(filter)).toBe('NOT ANSWERED')
  })

  it('Should be OR ANSWERED SEEN', () => {
    const filter: SearchFilter = {
      logical: {
        or: [[{ flags: { answered: true } }, { flags: { seen: true } }]],
      },
    }

    expect(generateSearchFilter(filter)).toBe('OR ANSWERED SEEN')
  })

  it('Should be OR NOT ANSWERED SEEN', () => {
    const filter: SearchFilter = {
      logical: {
        or: [[{ logical: { not: [{ flags: { answered: true } }] } }, { flags: { seen: true } }]],
      },
    }

    expect(generateSearchFilter(filter)).toBe('OR NOT ANSWERED SEEN')
  })

  it('Should be OR NOT ANSWERED OR SEEN FLAGGED', () => {
    const filter: SearchFilter = {
      logical: {
        or: [
          [
            { logical: { not: [{ flags: { answered: true } }] } },
            { logical: { or: [[{ flags: { seen: true } }, { flags: { flagged: true } }]] } },
          ],
        ],
      },
    }

    expect(generateSearchFilter(filter)).toBe('OR NOT ANSWERED OR SEEN FLAGGED')
  })

  it('Should be SUBJECT "it" FROM it@example.com OR NOT ANSWERED OR SEEN FLAGGED', () => {
    const filter: SearchFilter = {
      content: { subject: ['it'] },
      headers: { from: ['it@example.com'] },
      logical: {
        or: [
          [
            { logical: { not: [{ flags: { answered: true } }] } },
            { logical: { or: [[{ flags: { seen: true } }, { flags: { flagged: true } }]] } },
          ],
        ],
      },
    }

    expect(generateSearchFilter(filter))
      .contain('SUBJECT "it"')
      .and.contain('FROM it@example.com')
      .and.contain('OR NOT ANSWERED OR SEEN FLAGGED')
  })

  it('Should be TEXT "it" SUBJECT "test2" FROM it@example.com UNSEEN NEW', () => {
    const filter: SearchFilter = {
      content: {
        subject: ['test2'],
        text: ['it'],
      },
      headers: { from: ['it@example.com'] },
      flags: {
        seen: false,
        new: true,
      },
    }

    expect(generateSearchFilter(filter))
      .contain('SUBJECT "test2"')
      .and.contain('TEXT "it"')
      .and.contain('FROM it@example.com')
      .and.contain('UNSEEN')
      .and.contain('NEW')
  })
})

describe('Response parser', () => {
  it('Should be output array of one single digit number', () => {
    const parsed = parseSearchResponse('* SEARCH 1')
    expect(parsed).toStrictEqual([1])
  })

  it('Should be output array of two single digit numbers', () => {
    const parsed = parseSearchResponse('* SEARCH 1 2')
    expect(parsed).toStrictEqual([1, 2])
  })

  it('Should be output array of three single digit numbers', () => {
    const parsed = parseSearchResponse('* SEARCH 1 2 3')
    expect(parsed).toStrictEqual([1, 2, 3])
  })

  it('Should be output empty array', () => {
    const parsed = parseSearchResponse('* SEARCH')
    expect(parsed).toStrictEqual([])
  })

  it('Should be output array of one two-digit numbers ', () => {
    const parsed = parseSearchResponse('* SEARCH 10')
    expect(parsed).toStrictEqual([10])
  })

  it('Should be output array of two two-digit numbers ', () => {
    const parsed = parseSearchResponse('* SEARCH 13 20')
    expect(parsed).toStrictEqual([13, 20])
  })

  it('Should be output array of three two-digit numbers ', () => {
    const parsed = parseSearchResponse('* SEARCH 12 23 40')
    expect(parsed).toStrictEqual([12, 23, 40])
  })

  it('Should be output array of two single and two-digit numbers ', () => {
    const parsed = parseSearchResponse('* SEARCH 1 23')
    expect(parsed).toStrictEqual([1, 23])
  })

  it('Should be output array of four single and two-digit numbers ', () => {
    const parsed = parseSearchResponse('* SEARCH 12 3 40 5')
    expect(parsed).toStrictEqual([12, 3, 40, 5])
  })

  it('Should be output array of six single and two-digit numbers ', () => {
    const parsed = parseSearchResponse('* SEARCH 12 3 40 5 55 60')
    expect(parsed).toStrictEqual([12, 3, 40, 5, 55, 60])
  })

  it('Should be output array of three single, two-digit and three-digit numbers ', () => {
    const parsed = parseSearchResponse('* SEARCH 12 3 405')
    expect(parsed).toStrictEqual([12, 3, 405])
  })
})
