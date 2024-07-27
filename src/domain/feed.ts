export function createFeed(markdown: string): Feed {
    return new Feed(markdown)
}

class Feed {
    constructor(private markdown: string) {}

    errors(): string[] {
        if (this.markdown === "") {
            return ["Required configuration fields are missing: title, description, link"]
        }
        return []
    }
}
