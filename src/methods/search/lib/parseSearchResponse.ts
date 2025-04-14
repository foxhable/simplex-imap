export function parseSearchResponse(res: string): number[] {
  const result = res
    .match(/(\d+ |\d+$)/g)
    ?.map((i) => i.trim())
    .map(Number)

  return result || []
}
