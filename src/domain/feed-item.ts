import {parseDocument} from "htmlparser2"
import render from "dom-serializer"
import type {ChildNode} from "domhandler"
import {getAttributeValue, innerText} from "domutils"
import {rfc822} from "../language/date.js"

export type Item = {
    title: string;
    description: string;
    guid: string;
    pubDate: string | null;
    link: string | null;
}

export function title(item: Item): string {
    return item.title
}

const none: Array<never> = []
export function splitDocumentIntoItems(html: string): Item[] {
    const root = parseDocument(html)
    return root.children.flatMap((node) => {
        switch (node.type) {
            case "tag":
                if (node.name === "h2") {
                    const title = innerText(node)
                    return {
                        title,
                        description: render(getDescriptionNodes(node)).trim(),
                        guid: getAttributeValue(node, "id") ?? title,
                        pubDate: extractDate(title),
                        link: null,
                    }
                }
        }
        return none
    })
}

function getDescriptionNodes(heading: ChildNode): ChildNode[] {
    let ret = []
    let node = heading.nextSibling
    while (node && !isH2(node)) {
        ret.push(node)
        node = node.nextSibling
    }
    return ret
}

function extractDate(s: string): string | null {
    const match = s.match(/\d\d\d\d-\d\d-\d\d/)?.[0]
    if (!match) {
        return null
    }
    return rfc822(match)
}

function isH2(node: ChildNode): boolean {
    return node.type === "tag" && node.name === "h2"
}
