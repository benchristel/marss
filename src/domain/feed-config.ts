export class FeedConfig {
    constructor(private markdown: string) {}

    title(): string | null {
        return this.markdown.match(/title: ([^\n]+)/)?.[1] ?? null
    }

    description(): string | null {
        return this.markdown.match(/description: ([^\n]+)/)?.[1] ?? null
    }

    link(): string | null {
        return this.markdown.match(/link: ([^\n]+)/)?.[1] ?? null
    }
}
