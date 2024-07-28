import {marked} from "marked"
import {gfmHeadingId} from "marked-gfm-heading-id"

marked.use(gfmHeadingId())

export function htmlFromMarkdown(markdown: string): string {
    const s = marked.parse(markdown)
    if (s instanceof Promise) {
        throw new Error("marked returned a promise for some reason")
    }
    return s
}
