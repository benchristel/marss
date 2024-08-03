#!/usr/bin/env node
import {mkdirSync, readFileSync, writeFileSync} from "fs"
import {Feed} from "./domain/feed.js"
import {MarssError} from "./domain/marss-error.js"
import {parseArguments} from "./cli/args.js"
import {dirname} from "path"

try {
    const {inputPath, outputPath} = parseArguments(process.argv)

    const markdown = readFileSync(inputPath, "utf-8")

    const rss = new Feed(markdown).rss()

    mkdirSync(dirname(outputPath), {recursive: true})
    writeFileSync(outputPath, rss, "utf-8")
} catch (e) {
    if (e instanceof MarssError) {
        console.error(e.message)
        process.exit(1)
    } else {
        throw e
    }
}
