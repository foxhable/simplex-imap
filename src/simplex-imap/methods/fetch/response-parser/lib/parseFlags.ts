const FLAGS_REGEX = /FLAGS \((?<flags>(?:[\w\\$]+ ?)*)\)/

export function parseFlags(response: string): string[] {
  const flagsMatch = response.match(FLAGS_REGEX)

  if (flagsMatch?.groups?.flags) {
    return flagsMatch.groups.flags.split(' ')
  } else {
    return []
  }
}
