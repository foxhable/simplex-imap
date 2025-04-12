import { expect, describe, it } from 'vitest'
import { parseAddressFromEnvelope, parseAddressFromHeaders } from '@/main/methods/fetch/addressParser.js'
import type { AddressItem } from '@/main/methods/fetch/types.js'

describe('address parser from headers', () => {
  it('should parse one address with name', () => {
    const address = 'test <test@gmail.com>'
    const parsed = parseAddressFromHeaders(address)
    const should: AddressItem = {
      name: 'test',
      email: 'test@gmail.com',
    }
    expect(parsed).toStrictEqual([should])
  })

  it('should parse one address without name', () => {
    const address = 'test@gmail.com'
    const parsed = parseAddressFromHeaders(address)
    const should: AddressItem = {
      name: null,
      email: 'test@gmail.com',
    }
    expect(parsed).toStrictEqual([should])
  })

  it('should parse two addresses without name', () => {
    const address = 'test@gmail.com,some-test@test.ru'
    const parsed = parseAddressFromHeaders(address)
    const should: AddressItem = {
      name: null,
      email: 'test@gmail.com',
    }
    const should2: AddressItem = {
      name: null,
      email: 'some-test@test.ru',
    }
    expect(parsed).toStrictEqual([should, should2])
  })

  it('should parse two addresses with name', () => {
    const address = 'test <test@gmail.com>,Some Name <some-test@test.ru>'
    const parsed = parseAddressFromHeaders(address)
    const should: AddressItem = {
      name: 'test',
      email: 'test@gmail.com',
    }
    const should2: AddressItem = {
      name: 'Some Name',
      email: 'some-test@test.ru',
    }
    expect(parsed).toStrictEqual([should, should2])
  })

  it('should parse one address with name and one without', () => {
    const address = 'test <test@gmail.com>,some-test@test.ru'
    const parsed = parseAddressFromHeaders(address)
    const should: AddressItem = {
      name: 'test',
      email: 'test@gmail.com',
    }
    const should2: AddressItem = {
      name: null,
      email: 'some-test@test.ru',
    }
    expect(parsed).toStrictEqual([should, should2])
  })

  it('should parse three addresses', () => {
    const address = 'test <test@gmail.com>,some-test@test.ru,John Test <some1@test.test>'
    const parsed = parseAddressFromHeaders(address)
    const should: AddressItem = {
      name: 'test',
      email: 'test@gmail.com',
    }
    const should2: AddressItem = {
      name: null,
      email: 'some-test@test.ru',
    }
    const should3: AddressItem = {
      name: 'John Test',
      email: 'some1@test.test',
    }

    expect(parsed).toStrictEqual([should, should2, should3])
  })
})

describe('address parser from envelope', () => {
  it('should parse one address', () => {
    const address = '("Some Name" NIL "test-name" "gmail.com")'
    const parsed = parseAddressFromEnvelope(address)
    const should: AddressItem = {
      name: 'Some Name',
      email: 'test-name@gmail.com',
    }
    expect(parsed).toStrictEqual([should])
  })

  it('should parse one address with base64 in name', () => {
    const address = '("=?UTF-8?B?dGVzdCB0ZXN0?=" NIL "test" "tenvolve.ru")'
    const parsed = parseAddressFromEnvelope(address)
    const should: AddressItem = {
      name: '=?UTF-8?B?dGVzdCB0ZXN0?=',
      email: 'test@tenvolve.ru',
    }
    expect(parsed).toStrictEqual([should])
  })

  it('should parse two addresses', () => {
    const address = '("test test" NIL "test" "tenvolve.ru")("" NIL "foxhable" "gmail.com")'
    const parsed = parseAddressFromEnvelope(address)
    const should: AddressItem = {
      name: 'test test',
      email: 'test@tenvolve.ru',
    }
    const should2: AddressItem = {
      name: null,
      email: 'foxhable@gmail.com',
    }
    expect(parsed).toStrictEqual([should, should2])
  })

  it('should parse two addresses with NIL in name', () => {
    const address = '("test test" NIL "test" "tenvolve.ru")(NIL NIL "foxhable" "gmail.com")'
    const parsed = parseAddressFromEnvelope(address)
    const should: AddressItem = {
      name: 'test test',
      email: 'test@tenvolve.ru',
    }
    const should2: AddressItem = {
      name: null,
      email: 'foxhable@gmail.com',
    }
    expect(parsed).toStrictEqual([should, should2])
  })

  it('should parse two addresses with base64 in name', () => {
    const address = '("test test" NIL "test" "tenvolve.ru")("=?UTF-8?B?dGVzdCB0ZXN0?=" NIL "foxhable" "gmail.com")'
    const parsed = parseAddressFromEnvelope(address)
    const should: AddressItem = {
      name: 'test test',
      email: 'test@tenvolve.ru',
    }
    const should2: AddressItem = {
      name: '=?UTF-8?B?dGVzdCB0ZXN0?=',
      email: 'foxhable@gmail.com',
    }
    expect(parsed).toStrictEqual([should, should2])
  })

  it('should parse three addresses with base64 in name', () => {
    const address =
      '("test test" NIL "test" "tenvolve.ru")("=?UTF-8?B?dGVzdCB0ZXN0?=" NIL "foxhable" "gmail.com")("Name" NIL "some-test-123" "test-test.ru")'
    const parsed = parseAddressFromEnvelope(address)
    const should: AddressItem = {
      name: 'test test',
      email: 'test@tenvolve.ru',
    }
    const should2: AddressItem = {
      name: '=?UTF-8?B?dGVzdCB0ZXN0?=',
      email: 'foxhable@gmail.com',
    }
    const should3: AddressItem = {
      name: 'Name',
      email: 'some-test-123@test-test.ru',
    }
    expect(parsed).toStrictEqual([should, should2, should3])
  })
})
