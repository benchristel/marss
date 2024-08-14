import {expect, is, test} from "@benchristel/taste"
import {dateRegex} from "./feed-item-date.js"

test("dateRegex", {
    "recognizes a date with extra whitespace"() {
        const date = "January \t\n  1, \r  1970"
        expect(date.match(dateRegex)?.[0], is, date)
    },
})
