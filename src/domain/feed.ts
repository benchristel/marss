export function parseMarkdownFeed(markdown: string): MarkdownFeed {
    return new MarkdownFeed(markdown)
}

class MarkdownFeed {
    constructor(private markdown: string) {}

    errors(): string[] {
        if (this.markdown === "") {
            return ["Required configuration fields are missing: title, description, link"]
        }
        return []
    }
}
