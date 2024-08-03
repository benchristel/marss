#!/usr/bin/env node
import {readFileSync, writeFileSync} from "fs"
import {Feed} from "./domain/feed.js"
import {MarssError} from "./domain/marss-error.js"

try {
    const args = process.argv.slice(2)
    const [inputPath, outputPath] = args

    const markdown = readFileSync(inputPath, "utf-8")

    const feed = new Feed(markdown)

    writeFileSync(outputPath, feed.rss(), "utf-8")
} catch (e) {
    if (e instanceof MarssError) {
        console.error(e.message)
        process.exit(1)
    } else {
        throw e
    }
}
