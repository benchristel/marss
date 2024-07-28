import {marked} from "marked"
export function htmlFromMarkdown(markdown: string): string {
    const s = marked.parse(markdown)
    if (s instanceof Promise) {
        throw new Error("marked returned a promise for some reason")
    }
    return s
}
