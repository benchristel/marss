import {test, expect, is, trimMargin, not} from "@benchristel/taste"
import {Process, spawnSync} from "../src/platform/subprocess.js"
import {existsSync, mkdtempSync, readFileSync, writeFileSync} from "fs"
import {contains} from "../src/language/strings.js"

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

    "creates parent directories"() {
        const dir = createTempDir()
        writeFileSync(`${dir}/input.md`, minimalChannelConfig, "utf-8")

        marss(`${dir}/input.md`, `${dir}/a/b/output.rss`)

        expect(`${dir}/a/b/output.rss`, existsSync)
        const feed = readFileSync(`${dir}/a/b/output.rss`, "utf-8")
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

test("marss, given unrecognized config fields", {
    "logs an error"() {
        const dir = createTempDir()
        const input = trimMargin`
            # My Blog

            <!--
            @marss
            title: My Blog
            link: https://example.com
            description: this is a description
            foo: unrecognized
            bar: unrecognized
            -->
            `
        writeFileSync(`${dir}/input.md`, input, "utf-8")

        const {stderr} = marss(`${dir}/input.md`, `${dir}/output.rss`)

        expect(stderr.toString(), is, `Warning: unrecognized configuration fields are present: foo, bar\n`)
    },
})

test("marss, when input file doesn't exist", {
    "logs an error"() {
        const dir = createTempDir()
        const {stderr} = marss(`${dir}/i-do-not-exist.md`, `${dir}/output.rss`)
        expect(stderr.toString(), contains, "ENOENT: no such file or directory")
        expect(stderr.toString(), contains, "i-do-not-exist.md")
    },
})

test("marss, given multiple output files", {
    "writes each one in the appropriate format"() {
        const dir = createTempDir()
        writeFileSync(`${dir}/input.md`, minimalChannelConfig, "utf-8")

        marss(`${dir}/input.md`, `${dir}/output.rss`, `${dir}/output.html`)

        expect(`${dir}/output.rss`, existsSync)
        const rss = readFileSync(`${dir}/output.rss`, "utf-8")
        expect(rss, contains, `<rss version="2.0">`)

        expect(`${dir}/output.html`, existsSync)
        const html = readFileSync(`${dir}/output.html`, "utf-8")
        expect(html, contains, `<!--`)
    },
})
