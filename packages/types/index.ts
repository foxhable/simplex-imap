export type Permutations<T extends string, TLimiter extends string = ' ', U extends string = T> =
  T extends any ? (T | `${T}${TLimiter}${Permutations<Exclude<U, T>>}`) : never;

export type RepeatablePermutations<T extends string, TLimiter extends string = ' ', U extends string = T> =
  T extends any ? (T | `${T}${TLimiter}${Permutations<U>}`) : never;

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>