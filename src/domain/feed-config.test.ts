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
    test("FeedConfig, given a minimal @marss comment,", {
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

{
    const markdown = trimMargin`
        <!--
        @marss
        title: The Website of Winnie the Pooh
        link: https://example.com
        description: A bear of very little brain.
        htmlUrl: https://example.com/changelog.html
        language: en-us
        copyright: Copyright 1926-2024, Edward Bear
        imageUrl: https://example.com/88x31.gif
        managingEditor: pooh@100acre.wood (Edward Bear)
        webMaster: cr@100acre.wood (Christopher Robin)
        ttl: 3600
        publishAtUtcHour: 3
        -->`
    const config = parseFeedConfig(markdown)
    test("FeedConfig, given a maximal @marss comment,", {
        "has the title"() {
            expect(config.title, is, "The Website of Winnie the Pooh")
        },

        "has the description"() {
            expect(config.description, is, "A bear of very little brain.")
        },

        "has the link"() {
            expect(config.link, is, "https://example.com")
        },

        "has the htmlUrl"() {
            expect(config.htmlUrl, is, "https://example.com/changelog.html")
        },

        "has the language"() {
            expect(config.language, is, "en-us")
        },

        "has the copyright"() {
            expect(config.copyright, is, "Copyright 1926-2024, Edward Bear")
        },

        "has the image url"() {
            expect(config.imageUrl, is, "https://example.com/88x31.gif")
        },

        "has the managingEditor"() {
            expect(config.managingEditor, is, "pooh@100acre.wood (Edward Bear)")
        },

        "has the webMaster"() {
            expect(config.webMaster, is, "cr@100acre.wood (Christopher Robin)")
        },

        "has the ttl"() {
            expect(config.ttl, is, "3600")
        },

        "has publishAtUtcHour"() {
            expect(config.publishAtUtcHour, is, 3)
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
            htmlUrl: null,
            publishAtUtcHour: 0,
        })
    },

    "defaults invalid publishAtUtcHour to 0"() {
        const markdown = trimMargin(`
            <!--
            @marss
            title: foo
            description: bar
            link: baz
            publishAtUtcHour: asdf
            -->`)
        const config = parseFeedConfig(markdown)
        expect(config.publishAtUtcHour, is, 0)
    },

    "parses publishAtUtcHour in decimal"() {
        const markdown = trimMargin(`
            <!--
            @marss
            title: foo
            description: bar
            link: baz
            publishAtUtcHour: 09
            -->`)
        const config = parseFeedConfig(markdown)
        expect(config.publishAtUtcHour, is, 9)
    },
})
