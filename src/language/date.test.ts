import {expect, is, test} from "@benchristel/taste"
import {rfc822} from "./date.js"

test("rfc822", {
    "converts the epoch"() {
        expect(rfc822("1970-01-01 00:00:00"), is, "Thu, 01 Jan 1970 00:00:00 +0000")
    },
})
