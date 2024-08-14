import {expect, is, test} from "@benchristel/taste"
import {dateRegex, rfc822} from "./date.js"

test("rfc822", {
    "converts the epoch"() {
        expect(rfc822("1970-01-01 00:00:00"), is, "Thu, 01 Jan 1970 00:00:00 +0000")
    },

    "defaults time to midnight"() {
        expect(rfc822("1970-01-01"), is, "Thu, 01 Jan 1970 00:00:00 +0000")
    },

    "parses a date like 'August 13, 2024'"() {
        expect(rfc822("August 13, 2024"), is, "Tue, 13 Aug 2024 00:00:00 +0000")
    },

    "parses a date like 'Dec 1, 2024'"() {
        expect(rfc822("Dec 1, 2024"), is, "Sun, 01 Dec 2024 00:00:00 +0000")
    },
})

test("dateRegex", {
    "recognizes a date with extra whitespace"() {
        const date = "January \t\n  1, \r  1970"
        expect(date.match(dateRegex)?.[0], is, date)
    },
})
