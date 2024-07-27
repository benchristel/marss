import {test, expect, is, trimMargin, not} from "@benchristel/taste"
import {Process, spawnSync} from "../src/platform/subprocess.js"
import {existsSync, mkdtempSync, readFileSync, writeFileSync} from "fs"

function marss(...args: string[]): Process {
    return spawnSync("node", "dist/main.js", ...args)
}

function createTempDir(): string {
    return mkdtempSync("/tmp/marss-")
}

const minimalChannelConfig = trimMargin`
    <!--
    @marss
    title: A Cool Blog
    link: https://example.com
    description: this is the description
    -->`

test("marss, given valid input,", {
    "exits 0"() {
        const dir = createTempDir()
        writeFileSync(`${dir}/input.md`, minimalChannelConfig, "utf-8")

        const {success} = marss(`${dir}/input.md`, `${dir}/output.rss`)

        expect(success, is, true)
    },

    "doesn't write to stderr"() {
        const dir = createTempDir()
        writeFileSync(`${dir}/input.md`, minimalChannelConfig, "utf-8")

        const {stderr} = marss(`${dir}/input.md`, `${dir}/output.rss`)

        expect(stderr.toString(), is, "")
    },

    "writes an RSS file"() {
        const dir = createTempDir()
        writeFileSync(`${dir}/input.md`, minimalChannelConfig, "utf-8")

        marss(`${dir}/input.md`, `${dir}/output.rss`)

        expect(`${dir}/output.rss`, existsSync)
        const feed = readFileSync(`${dir}/output.rss`, "utf-8")
        expect(feed, contains, `<rss version="2.0">`)
    },
})

test("marss, given empty Markdown input,", {
    "exits nonzero"() {
        const dir = createTempDir()
        writeFileSync(`${dir}/input.md`, "", "utf-8")

        const {success} = marss(`${dir}/input.md`, `${dir}/output.rss`)

        expect(success, is, false)
    },

    "logs an error"() {
        const dir = createTempDir()
        writeFileSync(`${dir}/input.md`, "", "utf-8")

        const {stderr} = marss(`${dir}/input.md`, `${dir}/output.rss`)

        expect(stderr.toString(), is, `Required configuration fields are missing: title, description, link\n`)
    },

    "does not write the output file"() {
        const dir = createTempDir()
        writeFileSync(`${dir}/input.md`, "", "utf-8")

        marss(`${dir}/input.md`, `${dir}/output.rss`)

        expect(`${dir}/output.rss`, not(existsSync))
    },
})

function contains(needle: string, haystack: string): boolean {
    return haystack.includes(needle)
}
