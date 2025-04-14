type SectionPart = number | string
export type SectionPartObject = { sectionPart?: SectionPart }
export type PartialSlice = { partial?: [number, number] | { from: number; to?: number } | number }
export type SectionAndPartialSlice = SectionPartObject & PartialSlice

function parsePartial(config: Required<SectionAndPartialSlice>['partial']): string {
  if (typeof config === 'number') {
    return `<${config.toString()}>`
  }

  if (config instanceof Array) {
    const from = config[0].toString()
    const to = config[1] ? config[1].toString() : undefined
    return to ? `<${from}.${to}>` : `<${from}>`
  }

  const from = config.from.toString()
  const to = config.to?.toString()
  return to ? `<${from}.${to}>` : `<${from}>`
}

function parseSection(config: Required<SectionAndPartialSlice>['sectionPart'], addDot: boolean = true) {
  if (typeof config === 'string') {
    const cleared = config.trim().replace(/\.$/, '')
    return addDot ? `${cleared}.` : cleared
  }

  return addDot ? `${config.toString()}.` : config.toString()
}

export function parseSectionAndPartial(config: SectionAndPartialSlice, addSectionDot: boolean = true) {
  const partial = config.partial !== undefined ? parsePartial(config.partial) : ''
  const section = config.sectionPart !== undefined ? parseSection(config.sectionPart, addSectionDot) : ''

  return { partial, section }
}
