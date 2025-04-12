declare module 'utf7' {
    export function encode(str: string, mask: string): string

    export function encodeAll(str: string): string

    export const imap = {
        encode: (str: string) => string,
        decode: (str: string) => string,
    }
}