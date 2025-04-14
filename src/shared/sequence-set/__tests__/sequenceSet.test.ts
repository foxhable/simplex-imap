import { expect, test } from 'vitest'
import { convertSequenceSetToString } from '@/shared/sequence-set/index.js'

test('Should create string from one UID number', () => {
  const result = convertSequenceSetToString(1)
  expect(result).toStrictEqual('1')
})

test('Should create string from array of three numbers', () => {
  const result = convertSequenceSetToString([1, 2, 3])
  expect(result).toStrictEqual('1,2,3')
})

test('Should create string from array of one number', () => {
  const result = convertSequenceSetToString([1])
  expect(result).toStrictEqual('1')
})

test('Should create string from range of UID set', () => {
  const result = convertSequenceSetToString({ from: 1, to: 10 })
  expect(result).toStrictEqual('1:10')
})

test('Should create string from array of ranges with UID set', () => {
  const result = convertSequenceSetToString([
    { from: 1, to: 10 },
    { from: 10, to: 15 },
    { from: 155, to: 400 },
  ])
  expect(result).toStrictEqual('1:10,10:15,155:400')
})

test('Should create string from array of numbers and ranges with UID set', () => {
  const result = convertSequenceSetToString([{ from: 1, to: 10 }, 5, { from: 155, to: 400 }, 15])
  expect(result).toStrictEqual('1:10,5,155:400,15')
})

test('Should create string from range with only "from" field', () => {
  const result = convertSequenceSetToString({ from: 1 })
  expect(result).toStrictEqual('1:*')
})
