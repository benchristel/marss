import {readFileSync, writeFileSync} from "fs"
import {parseMarkdownFeed} from "./domain/feed.js"

const args = process.argv.slice(2)
const [inputPath, outputPath] = args

const markdown = readFileSync(inputPath, "utf-8")

const feedResult = parseMarkdownFeed(markdown)
if (!feedResult.ok) {
    const {error: errors} = feedResult
    for (const message of errors) {
        console.error(message)
    }
    process.exit(1)
}

const {value: feed} = feedResult
writeFileSync(outputPath, feed.rss(), "utf-8")
