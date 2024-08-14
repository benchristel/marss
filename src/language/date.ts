import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"

dayjs.extend(utc)

export function rfc822(d: Date | string): string {
    return dayjs(d).utc(true).format("ddd, DD MMM YYYY HH:mm:ss ZZ")
}
