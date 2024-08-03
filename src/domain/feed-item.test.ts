import {test, expect, equals, which, trimMargin, is} from "@benchristel/taste"
import {splitDocumentIntoItems, title} from "./feed-item.js"

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
                pubDate: null,
                link: null,
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
                pubDate: null,
                link: null,
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
                pubDate: null,
                link: null,
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
        expect(
            splitDocumentIntoItems(html).map(title),
            equals,
            ["one", "two"],
        )
    },

    "bases an item's guid on its heading id"() {
        const html = `<h2 id="foo">blah</h2>`
        expect(splitDocumentIntoItems(html)[0].guid, is, "foo")
    },

    "uses the title as the guid if the heading has no id"() {
        const html = `<h2>blah</h2>`
        expect(splitDocumentIntoItems(html)[0].guid, equals, "blah")
    },

    "links an item to a heading in the given URL"() {
        const html = `<h2 id="foo">blah</h2>`
        const url = "https://example.com/updates.html"
        expect(
            splitDocumentIntoItems(html, url)[0].link,
            is,
            "https://example.com/updates.html#foo",
        )
    },

    "parses a date out of the heading"() {
        const html = `<h2>2012-12-21</h2>`
        expect(splitDocumentIntoItems(html)[0]?.pubDate, equals, "Fri, 21 Dec 2012 00:00:00 +0000")
    },
})

function isAnything() {
    return true
}
