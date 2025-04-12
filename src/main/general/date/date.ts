import type { IMAPDate } from '@/main/general/types.js'

const monthsMap: {
  [index: number]: string
} = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
}

export function convertToIMAPDate(date: Date): IMAPDate {
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()

  return `${day}-${monthsMap[date.getMonth()]}-${date.getFullYear()}`
}