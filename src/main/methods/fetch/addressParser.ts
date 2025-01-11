import type { AddressesList, AddressItem } from '@/main/methods/fetch/types.js'

const ADDRESS_WITH_NAME_REGEX = /(?<name>[ \w_-]+) <(?<email>[\w_-]+@[\w-]+\.\w+)>/

export function parseAddressFromHeaders(raw: string): AddressesList {
  return raw.split(',').map<AddressItem>((address) => {
    const match = address.trim().match(ADDRESS_WITH_NAME_REGEX)

    if (match?.groups?.name && match?.groups?.email) {
      return {
        name: match.groups.name,
        email: match.groups.email,
      }
    } else {
      return {
        name: null,
        email: address.trim(),
      }
    }
  })
}

const ADDRESS_IN_PARENTHESIZED =
  /\((?:"(?<name>[^"]+)"|""|NIL) (?:NIL|""|.+) (?:"(?<emailName>[^"]+)"|""|NIL) (?:"(?<emailDomain>[^"]+)"|""|NIL)\)/g

export function parseAddressFromEnvelope(raw: string): AddressesList {
  const addressesMatch = raw.matchAll(ADDRESS_IN_PARENTHESIZED)
  return [...addressesMatch]
    .map<AddressItem | undefined>((match) => {
      if (!match.groups?.emailName || !match.groups?.emailDomain) return undefined

      return {
        name: match.groups?.name || null,
        email: `${match.groups?.emailName}@${match.groups?.emailDomain}`,
      }
    })
    .filter((i) => !!i)
}
