import {readFileSync, writeFileSync} from "fs"
import {parseMarkdownFeed} from "./domain/feed.js"

const args = process.argv.slice(2)
const [inputPath, outputPath] = args

const markdown = readFileSync(inputPath, "utf-8")

const feedResult = parseMarkdownFeed(markdown)
if (! feedResult.ok) {
    for (const message of feedResult.error) {
        console.error(message)
    }
    process.exit(1)
} else {
    writeFileSync(outputPath, `<rss version="2.0">`, "utf-8")
}
