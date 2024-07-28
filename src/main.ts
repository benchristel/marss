import {readFileSync, writeFileSync} from "fs"
import {parseMarkdownFeed} from "./domain/feed.js"
import {MarssError} from "./domain/marss-error.js"

const args = process.argv.slice(2)
const [inputPath, outputPath] = args

const markdown = readFileSync(inputPath, "utf-8")

const feed = (() => {
    try {
        return parseMarkdownFeed(markdown)
    } catch (e) {
        if (e instanceof MarssError) {
            console.error(e.message)
            process.exit(1)
        } else {
            throw e
        }
    }
})()

writeFileSync(outputPath, feed.rss(), "utf-8")
