import {readFileSync, writeFileSync} from "fs"
import {parseMarkdownFeed} from "./domain/feed.js"

const args = process.argv.slice(2)
const [inputPath, outputPath] = args

const markdown = readFileSync(inputPath, "utf-8")

const feed = parseMarkdownFeed(markdown)

if (feed.errors().length) {
    for (const error of feed.errors()) {
        console.error(error)
    }
    process.exit(1)
}

writeFileSync(outputPath, `<rss version="2.0">`, "utf-8")
