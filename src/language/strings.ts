export function trim(s: string): string {
    return s.trim()
}

export function contains(needle: string, haystack: string): boolean {
    return haystack.includes(needle)
}

export function containsIgnoringWhitespace(needle: string, haystack: string): boolean {
    return removeWhitespace(haystack).includes(removeWhitespace(needle))
}

function removeWhitespace(s: string): string {
    return s.replace(/\s+/g, "")
}
