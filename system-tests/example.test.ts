import {test, expect, is} from "@benchristel/taste"
import {spawnSync} from "../src/platform/subprocess"

test("a hello world program", {
    "prints 'Hello, world!'"() {
        const hello = spawnSync("node", "dist/main.js")
        expect(hello.stdout.toString(), is, "Hello, world!\n")
    },
})
