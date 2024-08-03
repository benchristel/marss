#!/usr/bin/env node
import {mkdirSync, readFileSync, writeFileSync} from "fs"
import {Feed} from "./domain/feed.js"
import {parseArguments} from "./cli/args.js"
import {dirname} from "path"

try {
    const {inputPath, outputPaths} = parseArguments(process.argv)

    const markdown = readFileSync(inputPath, "utf-8")

    const feed = new Feed(markdown)

    for (const outputPath of outputPaths) {
        mkdirSync(dirname(outputPath), {recursive: true})

        const output = outputPath.endsWith(".html")
            ? feed.html()
            : feed.rss()

        writeFileSync(outputPath, output, "utf-8")
    }
} catch (e) {
    if (e instanceof Error) {
        console.error(e.message)
        process.exit(1)
    } else {
        throw e
    }
}
