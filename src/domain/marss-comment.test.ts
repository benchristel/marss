import {test, expect, is, not, trimMargin} from "@benchristel/taste"
import {marssComment} from "./marss-comment.js"

test("parsing a marss comment", {
    "returns null when the comment is missing"() {
        const doc = "nothing here"
        expect(marssComment(doc), is, null)
    },

    "fails given an empty comment"() {
        const doc = "<!-- -->"
        expect(doc, not(hasMarssComment))
    },

    "succeeds given a one-line marss comment"() {
        const doc = "<!--@marss-->"
        expect(doc, hasMarssComment)
    },

    "succeeds when there is stuff around the comment"() {
        const doc = "before <!--@marss--> after"
        expect(doc, hasMarssComment)
    },

    "succeeds when @marss is on its own line"() {
        const doc = trimMargin`
            <!--
            @marss
            -->`
        expect(doc, hasMarssComment)
    },

    "succeeds when there is stuff after the @marss directive"() {
        const doc = `<!--@marss blah-->`
        expect(doc, hasMarssComment)
    },

    "succeeds when config fields are present"() {
        const doc = trimMargin`
            <!--
            @marss
            foo: bar
            -->`
        expect(doc, hasMarssComment)
    },

    "succeeds when fields contain dashes"() {
        const doc = trimMargin`
            <!--
            @marss
            foo: bar--baz
            -->`
        expect(doc, hasMarssComment)
    },

    "returns just the comment when it is found"() {
        const doc = "before <!--@marss--> after"
        expect(marssComment(doc), is, "<!--@marss-->")
    },

    "returns the first valid comment"() {
        const doc = "<!-- --> <!--@marss first--> <!--@marss second-->"
        expect(marssComment(doc), is, "<!--@marss first-->")
    },
})

function hasMarssComment(s: string): boolean {
    return marssComment(s) != null
}
