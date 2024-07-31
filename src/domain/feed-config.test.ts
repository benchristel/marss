import {test, expect, is, trimMargin, equals} from "@benchristel/taste"
import {parseFeedConfig} from "./feed-config.js"
import {errorFrom} from "../lib/testing.test.js"
import {MarssError} from "./marss-error.js"

test("FeedConfig, given an empty document,", {
    "throws an error"() {
        expect(
            errorFrom(() => parseFeedConfig("")),
            equals,
            new MarssError("Required configuration fields are missing: title, description, link"),
        )
    },
})

{
    const markdown = trimMargin`
        <!--
        @marss
        title: The Title
        description: The Description
        link: https://foo.bar
        -->`
    const config = parseFeedConfig(markdown)
    test("FeedConfig, given a @marss comment,", {
        "has the title from the comment"() {
            expect(config.title, is, "The Title")
        },

        "has the description from the comment"() {
            expect(config.description, is, "The Description")
        },

        "has the link from the comment"() {
            expect(config.link, is, "https://foo.bar")
        },
    })
}

test("FeedConfig", {
    "parses a title that contains 'description:'"() {
        const markdown = trimMargin`
            <!--
            @marss
            title: description: 1
            description: doesn't matter
            link: doesn't matter
            -->`
        const config = parseFeedConfig(markdown)
        expect(config.title, is, "description: 1")
    },

    "removes leading whitespace from fields"() {
        const markdown = trimMargin`
            <!--
            @marss
            title:    \t blah
            description: doesn't matter
            link: doesn't matter
            -->`
        const config = parseFeedConfig(markdown)
        expect(config.title, is, "blah")
    },

    "parses fields with no space after the colon"() {
        const markdown = trimMargin`
            <!--
            @marss
            title:blah
            description: doesn't matter
            link: doesn't matter
            -->`
        const config = parseFeedConfig(markdown)
        expect(config.title, is, "blah")
    },

    "parses fields with extra space before the colon"() {
        const markdown = trimMargin`
            <!--
            @marss
            title  : blah
            description: doesn't matter
            link: doesn't matter
            -->`
        const config = parseFeedConfig(markdown)
        expect(config.title, is, "blah")
    },

    "parses indented fields"() {
        const markdown = trimMargin`
            <!--
            @marss
              \t title: blah
            description: doesn't matter
            link: doesn't matter
            -->`
        const config = parseFeedConfig(markdown)
        expect(config.title, is, "blah")
    },

    "ignores end-of-line whitespace"() {
        const markdown = trimMargin(`
            <!--
            @marss
            title: blah${"  "}
            description: doesn't matter
            link: doesn't matter
            -->`)
        const config = parseFeedConfig(markdown)
        expect(config.title, is, "blah")
    },

    "ignores lines that aren't a header-style key-value pair"() {
        const markdown = trimMargin(`
            <!--
            @marss
            title: foo
            description: bar
            link: baz
            this line should be ignored
            -->`)
        const config = parseFeedConfig(markdown)
        expect(config, equals, {
            title: "foo",
            description: "bar",
            link: "baz",
            language: null,
            copyright: null,
            imageUrl: null,
            managingEditor: null,
            webMaster: null,
            ttl: null,
        })
    },
})
