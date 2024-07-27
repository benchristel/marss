import {writeFileSync} from "fs"

const args = process.argv.slice(2)
const outputPath = args[1]
writeFileSync(outputPath, `<rss version="2.0">`, "utf-8")
