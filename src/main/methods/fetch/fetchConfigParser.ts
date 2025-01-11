import type { FetchConfig, FetchDataItem, SectionAndPartialSlice } from '@/main/types.js'

function parseSection(config: Required<SectionAndPartialSlice>['sectionPart'], addDot: boolean = true) {
  if (typeof config === 'string') {
    const cleared = config.trim().replace(/\.$/, '')
    return addDot ? `${cleared}.` : cleared
  }

  return addDot ? `${config.toString()}.` : config.toString()
}

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

function parseSectionAndPartial(config: SectionAndPartialSlice, addSectionDot: boolean = true) {
  const partial = config.partial !== undefined ? parsePartial(config.partial) : ''
  const section = config.sectionPart !== undefined ? parseSection(config.sectionPart, addSectionDot) : ''

  return { partial, section }
}

function parseFetchDataItem(object: FetchDataItem): string[] {
  const result: string[] = []

  if (object.uid) result.push('UID')
  if (object.flags) result.push('FLAGS')
  if (object.size) result.push('RFC822.SIZE')
  if (object.internaldate) result.push('INTERNALDATE')
  if (object.envelope) result.push('ENVELOPE')
  if (object.bodyStructure) result.push('BODYSTRUCTURE')

  if (object.body && typeof object.body === 'object') {
    const data = parseSectionAndPartial(object.body, false)
    result.push(`BODY[${data.section}]${data.partial}`)
  } else if (object.body) {
    result.push('BODY[]')
  }

  if (object.bodyHeader && typeof object.bodyHeader === 'object') {
    const data = parseSectionAndPartial(object.bodyHeader)
    result.push(`BODY[${data.section}HEADER]${data.partial}`)
  } else if (object.bodyHeader) {
    result.push('BODY[HEADER]')
  }

  if (object.bodyText && typeof object.bodyText === 'object') {
    const data = parseSectionAndPartial(object.bodyText)
    result.push(`BODY[${data.section}TEXT]${data.partial}`)
  } else if (object.bodyText) {
    result.push('BODY[TEXT]')
  }

  if (object.bodyMime) {
    const data = parseSectionAndPartial(object.bodyMime)
    result.push(`BODY[${data.section}MIME]${data.partial}`)
  }

  if (object.bodyHeaderFields) {
    const data = parseSectionAndPartial(object.bodyHeaderFields)
    const header = object.bodyHeaderFields.not ? 'HEADER.FIELDS.NOT' : 'HEADER.FIELDS'
    const fields = object.bodyHeaderFields.fieldNames.join(' ')
    result.push(`BODY[${data.section}${header} (${fields})]${data.partial}`)
  }

  return result
}

export function parseFetchConfig(config: FetchConfig): string {
  if (typeof config === 'object' && 'raw' in config) {
    return config.raw
  }

  if (typeof config === 'string') {
    return config
  }

  if (config instanceof Array) {
    const parsedItems = config.map(parseFetchDataItem).flat()
    const uniq = [...new Set(parsedItems)]
    return uniq.length > 1 ? `(${uniq.join(' ')})` : uniq.join(' ')
  }

  const parsed = parseFetchDataItem(config)
  const parsedStr = parsed.join(' ')
  return parsed.length > 1 ? `(${parsedStr})` : parsedStr
}
