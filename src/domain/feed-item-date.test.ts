import {expect, is, not, test} from "@benchristel/taste"
import {dateRegex} from "./feed-item-date.js"

test("dateRegex", {
    "recognizes a date with extra whitespace"() {
        expect("January \t\n  1, \r  1970", isRecognizableDate)
    },

    "recognizes the format '2024-08-14'"() {
        expect("2024-08-14", isRecognizableDate)
    },

    "recognizes the format 'August 14, 2024'"() {
        expect("August 14, 2024", isRecognizableDate)
    },

    "recognizes the format 'August 14 2024' (with no comma)"() {
        expect("August 14 2024", isRecognizableDate)
    },

    "recognizes the format 'Aug 14, 2024'"() {
        expect("Aug 14, 2024", isRecognizableDate)
    },

    "recognizes the format 'Aug 14 2024' (with no comma)"() {
        expect("Aug 14 2024", isRecognizableDate)
    },

    "does not recognize the empty string"() {
        expect("", not(isRecognizableDate))
    },

    "does not recognize ! as a separator"() {
        expect("2024!08!14", not(isRecognizableDate))
    },
})

function isRecognizableDate(s: string): boolean {
    return s.match(dateRegex) !== null
}
