import { describe, expect, it } from 'vitest'
import { convertToIMAPDate } from './date.js'

describe('Date converter', () => {
  it('Should be convert to "01-Jan-2000"', () => {
    const date = new Date('2000-01-01')

    expect(convertToIMAPDate(date)).toBe('01-Jan-2000')
  })

  it('Should be convert to "25-Jan-2000"', () => {
    const date = new Date('2000-01-25')

    expect(convertToIMAPDate(date)).toBe('25-Jan-2000')
  })

  it('Should be convert to "25-Oct-2005"', () => {
    const date = new Date('2005-10-25')

    expect(convertToIMAPDate(date)).toBe('25-Oct-2005')
  })
})