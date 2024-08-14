import {expect, is, test} from "@benchristel/taste"
import {rfc822} from "./date.js"

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
})
