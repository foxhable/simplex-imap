const INTERNALDATE_REGEX = /INTERNALDATE "(?<internalDate>\d{2}-\w{3}-\d{4} (\d\d:?){3} \+\d{4})"/

export function parseInternalDate(response: string) {
  const dateMatch = response.match(INTERNALDATE_REGEX)

  if (dateMatch?.groups?.internalDate) {
    return new Date(dateMatch.groups.internalDate)
  } else {
    return null
  }
}
