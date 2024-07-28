export function errorFrom(f: () => unknown): Error | null {
    try {
        f()
    } catch (e) {
        if (e instanceof Error) return e
    }
    return null
}
