import dayjs, {Dayjs} from "dayjs"
import utc from "dayjs/plugin/utc.js"

dayjs.extend(utc)

export function rfc822(d: Dayjs): string {
    return d.format("ddd, DD MMM YYYY HH:mm:ss ZZ")
}

export function parseUtc(d: Date | string): Dayjs {
    return dayjs(d).utc(true)
}
