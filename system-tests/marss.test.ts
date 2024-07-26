import {test, expect, is} from "@benchristel/taste"
import {Process, spawnSync} from "../src/platform/subprocess"

function marss(): Process {
    return spawnSync("node", "dist/main.js")
}

test("marss", {
    "runs successfully"() {
        const {success} = marss()
        expect(success, is, true)
    },

    "doesn't log to stderr"() {
        const {stderr} = marss()
        expect(stderr.toString(), is, "")
    },
})
