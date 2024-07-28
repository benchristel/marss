import {test, expect, is} from "@benchristel/taste"
import {htmlFromMarkdown} from "./markdown.js"

test("htmlFromMarkdown", {
    "gives each heading an id attribute"() {
        const html = htmlFromMarkdown("## title")
        expect(html, is, `<h2 id="title">title</h2>\n`)
    },

    "sluggifies the heading ids"() {
        const html = htmlFromMarkdown("## 2024-01-01: Happy New Year!")
        expect(html, is, `<h2 id="2024-01-01-happy-new-year">2024-01-01: Happy New Year!</h2>\n`)
    },
})
