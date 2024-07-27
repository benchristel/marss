import {test, expect, is, trimMargin} from "@benchristel/taste"
import {parseFeedConfig} from "./feed-config.js"

{
    const config = parseFeedConfig("")
    test("FeedConfig, given an empty document,", {
        "has null title"() {
            expect(config.title, is, null)
        },

        "has null description"() {
            expect(config.description, is, null)
        },

        "has null link"() {
            expect(config.link, is, null)
        },
    })
}

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

{
    const markdown = trimMargin`
        <!--
        title: The Title
        description: The Description
        link: https://foo.bar
        -->`
    const config = parseFeedConfig(markdown)
    test("FeedConfig, given a comment with no @marss directive,", {
        "has null title"() {
            expect(config.title, is, null)
        },
    })
}