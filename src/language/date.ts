import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"

dayjs.extend(utc)

export function rfc822(d: Date | string): string {
    return dayjs(d).utc(true).format("ddd, DD MMM YYYY HH:mm:ss ZZ")
}

const format1 = String.raw`\d\d\d\d-\d\d-\d\d`
const format2 = String.raw`(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d\d?,?\s+\d{4}`

export const dateRegex = new RegExp(
    `(${format1}|${format2})`,
    "i",
)
