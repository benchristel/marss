import {test, expect, is, trimMargin} from "@benchristel/taste"
import {Process, spawnSync} from "../src/platform/subprocess"
import {existsSync, mkdtempSync, readFileSync, writeFileSync} from "fs"

function marss(...args: string[]): Process {
    return spawnSync("node", "dist/main.js", ...args)
}

test("marss", {
    "writes the requested RSS file"() {
        const input = trimMargin`
            <!--
            @marss
            title: A Cool Blog
            link: https://example.com
            description: this is the description
            -->`
        const dir = mkdtempSync("/tmp/marss-")
        writeFileSync(`${dir}/input.md`, input, "utf-8")

        const {success, stderr} = marss(`${dir}/input.md`, `${dir}/output.rss`)

        expect(success, is, true)
        expect(stderr.toString(), is, "")
        expect(existsSync(`${dir}/output.rss`), is, true)
        const feed = readFileSync(`${dir}/output.rss`, "utf-8")
        expect(feed, contains, `<rss version="2.0">`)
    },
})

function contains(needle: string, haystack: string): boolean {
    return haystack.includes(needle)
}
