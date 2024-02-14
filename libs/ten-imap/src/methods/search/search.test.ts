import { describe, expect, test } from 'vitest'
import type { SearchFilter } from './types.js'
import { generateSearchFilter } from './search.js'
import { HEADER_FIELDS } from './types.js'
import { convertToIMAPDate } from '../../general/date/date.js'
import { MAILBOX_FLAGS } from '../../classes/Mailbox/types.js'

describe('Search method', () => {
  describe('Filter generator', () => {
    describe('Simple single filters', () => {
      describe('Filter by headers', () => {
        test('Should be set HEADER sender', () => {
          const filter: SearchFilter = {
            headers: { header: [ { field: HEADER_FIELDS.SENDER, value: 'test@example.ru' } ] },
          }

          expect(generateSearchFilter(filter)).toBe('HEADER sender test@example.ru')
        })

        test('Should be set HEADER sender and HEADER subject', () => {
          const filter: SearchFilter = {
            headers: {
              header: [
                { field: HEADER_FIELDS.SENDER, value: 'test@example.ru' },
                { field: HEADER_FIELDS.SUBJECT, value: 'test' },
              ],
            },
          }

          expect(generateSearchFilter(filter)).toBe('HEADER sender test@example.ru HEADER subject test')
        })

        test('Should be set one BCC', () => {
          const filter: SearchFilter = {
            headers: { bcc: [ 'test' ] },
          }

          expect(generateSearchFilter(filter)).toBe('BCC "test"')
        })

        test('Should be set two BCC', () => {
          const filter: SearchFilter = {
            headers: { bcc: [ 'test', 'test1' ] },
          }

          expect(generateSearchFilter(filter)).toBe('BCC "test" BCC "test1"')
        })

        test('Should be set one CC', () => {
          const filter: SearchFilter = {
            headers: { cc: [ 'test' ] },
          }

          expect(generateSearchFilter(filter)).toBe('CC "test"')
        })

        test('Should be set two CC', () => {
          const filter: SearchFilter = {
            headers: { cc: [ 'test', 'test1' ] },
          }

          expect(generateSearchFilter(filter)).toBe('CC "test" CC "test1"')
        })

        test('Should be set one FROM', () => {
          const filter: SearchFilter = {
            headers: { from: [ 'test@example.com' ] },
          }

          expect(generateSearchFilter(filter)).toBe('FROM test@example.com')
        })

        test('Should be set two FROM', () => {
          const filter: SearchFilter = {
            headers: { from: [ 'test@example.com', 'test1@example.com' ] },
          }

          expect(generateSearchFilter(filter)).toBe('FROM test@example.com FROM test1@example.com')
        })

        test('Should be set one TO', () => {
          const filter: SearchFilter = {
            headers: { to: [ 'test@example.com' ] },
          }

          expect(generateSearchFilter(filter)).toBe('TO test@example.com')
        })

        test('Should be set two TO', () => {
          const filter: SearchFilter = {
            headers: { to: [ 'test@example.com', 'test1@example.com' ] },
          }

          expect(generateSearchFilter(filter)).toBe('TO test@example.com TO test1@example.com')
        })
      })

      describe('Filter by dates', () => {
        test('Should be set one ON date', () => {
          const date = new Date()
          const filter: SearchFilter = {
            date: { on: [ date ] },
          }

          expect(generateSearchFilter(filter)).toBe(`ON ${convertToIMAPDate(date)}`)
        })

        test('Should be set two ON date', () => {
          const date = new Date()
          const date2 = new Date(date.getTime() + 60 * 60 * 1000)

          const filter: SearchFilter = {
            date: { on: [ date, date2 ] },
          }

          expect(generateSearchFilter(filter)).toBe(`ON ${convertToIMAPDate(date)} ON ${convertToIMAPDate(date2)}`)
        })

        test('Should be set SENTON date', () => {
          const date = new Date()
          const filter: SearchFilter = {
            date: { sentOn: [ date ] },
          }

          expect(generateSearchFilter(filter)).toBe(`SENTON ${convertToIMAPDate(date)}`)
        })

        test('Should be set SINCE date', () => {
          const date = new Date()
          const filter: SearchFilter = {
            date: { since: [ date ] },
          }

          expect(generateSearchFilter(filter)).toBe(`SINCE ${convertToIMAPDate(date)}`)
        })

        test('Should be set SENTSINCE date', () => {
          const date = new Date()
          const filter: SearchFilter = {
            date: { sentSince: [ date ] },
          }

          expect(generateSearchFilter(filter)).toBe(`SENTSINCE ${convertToIMAPDate(date)}`)
        })

        test('Should be set BEFORE date', () => {
          const date = new Date()
          const filter: SearchFilter = {
            date: { before: [ date ] },
          }

          expect(generateSearchFilter(filter)).toBe(`BEFORE ${convertToIMAPDate(date)}`)
        })

        test('Should be set SENTBEFORE date', () => {
          const date = new Date()
          const filter: SearchFilter = {
            date: { sentBefore: [ date ] },
          }

          expect(generateSearchFilter(filter)).toBe(`SENTBEFORE ${convertToIMAPDate(date)}`)
        })
      })

      describe('Filter by content', () => {
        test('Should be set SUBJECT', () => {
          const date = new Date()
          const filter: SearchFilter = {
            content: { subject: [ 'test' ] },
          }

          expect(generateSearchFilter(filter)).toBe(`SUBJECT "test"`)
        })

        test('Should be set BODY', () => {
          const date = new Date()
          const filter: SearchFilter = {
            content: { body: [ 'test' ] },
          }

          expect(generateSearchFilter(filter)).toBe(`BODY "test"`)
        })

        test('Should be set TEXT', () => {
          const date = new Date()
          const filter: SearchFilter = {
            content: { text: [ 'test' ] },
          }

          expect(generateSearchFilter(filter)).toBe(`TEXT "test"`)
        })
      })

      describe('Filter by props', () => {
        test('Should be set UID', () => {
          const filter: SearchFilter = {
            props: { uid: [ '1' ] },
          }

          expect(generateSearchFilter(filter)).toBe('UID 1')
        })

        test('Should be set one KEYWORD', () => {
          const filter: SearchFilter = {
            props: { keyword: [ MAILBOX_FLAGS.FLAGGED ] },
          }

          expect(generateSearchFilter(filter)).toBe(`KEYWORD ${MAILBOX_FLAGS.FLAGGED}`)
        })

        test('Should be set two KEYWORD', () => {
          const filter: SearchFilter = {
            props: { keyword: [ MAILBOX_FLAGS.FLAGGED, MAILBOX_FLAGS.DELETED ] },
          }

          expect(generateSearchFilter(filter)).toBe(`KEYWORD ${MAILBOX_FLAGS.FLAGGED} KEYWORD ${MAILBOX_FLAGS.DELETED}`)
        })

        test('Should be set UNKEYWORD', () => {
          const filter: SearchFilter = {
            props: { unKeyword: [ MAILBOX_FLAGS.FLAGGED ] },
          }

          expect(generateSearchFilter(filter)).toBe(`UNKEYWORD ${MAILBOX_FLAGS.FLAGGED}`)
        })

        test('Should be set LARGER', () => {
          const filter: SearchFilter = {
            props: { larger: [ 200 ] },
          }

          expect(generateSearchFilter(filter)).toBe(`LARGER 200`)
        })

        test('Should be set SMALLER', () => {
          const filter: SearchFilter = {
            props: { smaller: [ 200 ] },
          }

          expect(generateSearchFilter(filter)).toBe(`SMALLER 200`)
        })
      })

      describe('Filter by flags', () => {
        test('Should be ANSWERED', () => {
          const filter: SearchFilter = {
            flags: { answered: true },
          }

          expect(generateSearchFilter(filter)).toBe('ANSWERED')
        })

        test('Should be UNANSWERED', () => {
          const filter: SearchFilter = {
            flags: { answered: false },
          }

          expect(generateSearchFilter(filter)).toBe('UNANSWERED')
        })

        test('Should be DELETED', () => {
          const filter: SearchFilter = {
            flags: { deleted: true },
          }

          expect(generateSearchFilter(filter)).toBe('DELETED')
        })

        test('Should be UNDELETED', () => {
          const filter: SearchFilter = {
            flags: { deleted: false },
          }

          expect(generateSearchFilter(filter)).toBe('UNDELETED')
        })

        test('Should be DRAFT', () => {
          const filter: SearchFilter = {
            flags: { draft: true },
          }

          expect(generateSearchFilter(filter)).toBe('DRAFT')
        })

        test('Should be UNDRAFT', () => {
          const filter: SearchFilter = {
            flags: { draft: false },
          }

          expect(generateSearchFilter(filter)).toBe('UNDRAFT')
        })

        test('Should be SEEN', () => {
          const filter: SearchFilter = {
            flags: { seen: true },
          }

          expect(generateSearchFilter(filter)).toBe('SEEN')
        })

        test('Should be UNSEEN', () => {
          const filter: SearchFilter = {
            flags: { seen: false },
          }

          expect(generateSearchFilter(filter)).toBe('UNSEEN')
        })

        test('Should be FLAGGED', () => {
          const filter: SearchFilter = {
            flags: { flagged: true },
          }

          expect(generateSearchFilter(filter)).toBe('FLAGGED')
        })

        test('Should be UNFLAGGED', () => {
          const filter: SearchFilter = {
            flags: { flagged: false },
          }

          expect(generateSearchFilter(filter)).toBe('UNFLAGGED')
        })
      })
    })

    describe('Advanced filters', () => {
      test('Should be NOT ANSWERED', () => {
        const filter: SearchFilter = {
          logical: { not: [ { flags: { answered: true } } ] },
        }

        expect(generateSearchFilter(filter)).toBe('NOT ANSWERED')
      })

      test('Should be OR ANSWERED SEEN', () => {
        const filter: SearchFilter = {
          logical: {
            or: [
              [
                { flags: { answered: true } },
                { flags: { seen: true } },
              ],
            ],
          },
        }

        expect(generateSearchFilter(filter)).toBe('OR ANSWERED SEEN')
      })

      test('Should be OR NOT ANSWERED SEEN', () => {
        const filter: SearchFilter = {
          logical: {
            or: [
              [
                { logical: { not: [ { flags: { answered: true } } ] } },
                { flags: { seen: true } },
              ],
            ],
          },
        }

        expect(generateSearchFilter(filter)).toBe('OR NOT ANSWERED SEEN')
      })

      test('Should be OR NOT ANSWERED OR SEEN FLAGGED', () => {
        const filter: SearchFilter = {
          logical: {
            or: [
              [
                { logical: { not: [ { flags: { answered: true } } ] } },
                { logical: { or: [ [ { flags: { seen: true } }, { flags: { flagged: true } } ] ] } },
              ],
            ],
          },
        }

        expect(generateSearchFilter(filter)).toBe('OR NOT ANSWERED OR SEEN FLAGGED')
      })

      test('Should be SUBJECT "test" FROM test@example.com OR NOT ANSWERED OR SEEN FLAGGED', () => {
        const filter: SearchFilter = {
          content: { subject: ['test'] },
          headers: { from: [ 'test@example.com' ] },
          logical: {
            or: [
              [
                { logical: { not: [ { flags: { answered: true } } ] } },
                { logical: { or: [ [ { flags: { seen: true } }, { flags: { flagged: true } } ] ] } },
              ],
            ],
          },
        }

        expect(generateSearchFilter(filter)).contain('SUBJECT "test"')
        expect(generateSearchFilter(filter)).contain('FROM test@example.com')
        expect(generateSearchFilter(filter)).contain('OR NOT ANSWERED OR SEEN FLAGGED')
      })

      test('Should be TEXT "test" SUBJECT "test2" FROM test@example.com UNSEEN NEW', () => {
        const filter: SearchFilter = {
          content: {
            subject: ['test2'],
            text: ['test']
          },
          headers: { from: [ 'test@example.com' ] },
          flags: {
            seen: false,
            new: true,
          }
        }

        expect(generateSearchFilter(filter)).contain('SUBJECT "test2"')
        expect(generateSearchFilter(filter)).contain('TEXT "test"')
        expect(generateSearchFilter(filter)).contain('FROM test@example.com')
        expect(generateSearchFilter(filter)).contain('UNSEEN')
        expect(generateSearchFilter(filter)).contain('NEW')
      })
    })
  })
})