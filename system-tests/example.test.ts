import {test, expect, is} from "@benchristel/taste"

declare const Bun: any

test("a hello world program", {
    async "prints 'Hello, world!'"() {
        const hello = Bun.spawn(["node", "dist/main.js"])
        const stdout = await new Response(hello.stdout).text()
        expect(stdout, is, "Hello, world!\n")
    },
})
