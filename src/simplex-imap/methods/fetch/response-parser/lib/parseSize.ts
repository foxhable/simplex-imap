const SIZE_REGEX = /RFC822.SIZE (?<size>\d+)/

export function parseSize(response: string) {
  const sizeMatch = response.match(SIZE_REGEX)

  if (sizeMatch?.groups?.size) {
    return Number(sizeMatch.groups.size)
  } else {
    return null
  }
}
