export function marssComment(document: string): string | null {
    return document.match(/<!--\s*@marss(.|\n)*?-->/)?.[0] ?? null
}
