import {test, expect, equals, which, trimMargin} from "@benchristel/taste"
import {splitDocumentIntoItems} from "./feed-item.js"

test("splitDocumentIntoItems", {
    "returns an empty array given empty HTML"() {
        const html = ""
        expect(splitDocumentIntoItems(html), equals, [])
    },

    "returns an empty array given HTML with no <h2> tags"() {
        const html = "<p>no headings</p>"
        expect(splitDocumentIntoItems(html), equals, [])
    },

    "returns one item"() {
        const html = "<h2>one</h2>"
        expect(splitDocumentIntoItems(html), equals, [
            {
                title: "one",
                description: "",
                guid: which(isAnything),
            },
        ])
    },

    "strips HTML tags from the title"() {
        const html = "<h2><span>one</span></h2>"
        expect(splitDocumentIntoItems(html), equals, [
            {
                title: "one",
                description: "",
                guid: which(isAnything),
            },
        ])
    },

    "includes HTML following the item's h2 in its description"() {
        const html = trimMargin`
          <h2>the title</h2>
          <p>hello</p>
          <p>world</p>
          `
        expect(splitDocumentIntoItems(html), equals, [
            {
                title: "the title",
                description: "<p>hello</p>\n<p>world</p>",
                guid: which(isAnything),
            },
        ])
    },

    "separates multiple items"() {
        const html = trimMargin`
          <h2>one</h2>
          <p>hello</p>
          <h2>two</h2>
          <p>world</p>
          `
        expect(splitDocumentIntoItems(html), equals, [
            {
                title: "one",
                description: "<p>hello</p>",
                guid: which(isAnything),
            },
            {
                title: "two",
                description: "<p>world</p>",
                guid: which(isAnything),
            },
        ])
    },

    "bases an item's guid on its heading id"() {
        const html = `<h2 id="foo">blah</h2>`
        expect(splitDocumentIntoItems(html), equals, [
            {
                title: "blah",
                description: "",
                guid: "foo",
            },
        ])
    },

    "uses the title as the guid if the heading has no id"() {
        const html = `<h2>blah</h2>`
        expect(splitDocumentIntoItems(html), equals, [
            {
                title: "blah",
                description: "",
                guid: "blah",
            },
        ])
    },
})

function isAnything() {
    return true
}
