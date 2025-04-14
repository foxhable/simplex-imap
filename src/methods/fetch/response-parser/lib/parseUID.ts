const UID_REGEX = /UID (?<uid>\d+)/

export function parseUID(response: string) {
  const uidMatch = response.match(UID_REGEX)

  if (uidMatch?.groups?.uid) {
    return Number(uidMatch.groups.uid)
  } else {
    return null
  }
}
