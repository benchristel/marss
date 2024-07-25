import {test, expect, is} from "@benchristel/taste"

declare const Bun: any

test("a hello world program", {
    "prints 'Hello, world!'"() {
        const hello = Bun.spawnSync(["node", "dist/main.js"])
        expect(hello.stdout.toString(), is, "Hello, world!\n")
    },
})
