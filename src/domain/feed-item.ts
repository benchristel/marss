import {parseDocument} from "htmlparser2"
import render from "dom-serializer"
import type {ChildNode} from "domhandler"
import {getAttributeValue, innerText} from "domutils"
import {rfc822} from "../language/date.js"
import {dateRegex} from "./feed-item-date.js"
import dayjs from "dayjs"
import {isH2} from "../lib/dom.js"

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

const defaultParseParams = {
    htmlUrl: null,
    publishAtUtcHour: undefined,
}

export function parseFeedItems(
    html: string,
    params: {
        htmlUrl?: string | null;
        publishAtUtcHour?: number | undefined;
    } = defaultParseParams,
): Item[] {
    const {htmlUrl, publishAtUtcHour} = params
    const root = parseDocument(html)
    return root.children.flatMap((node) => {
        switch (node.type) {
            case "tag":
                if (node.name === "h2") {
                    const title = innerText(node)
                    const id = getAttributeValue(node, "id")
                    return {
                        title,
                        description: render(getDescriptionNodes(node)).trim(),
                        guid: id ?? title,
                        pubDate: extractDate(title, publishAtUtcHour),
                        link: htmlUrl && id ? `${htmlUrl}#${id}` : null,
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

function extractDate(s: string, hourOffset: number = 0): string | null {
    const match = s.match(dateRegex)?.[0]
    if (!match) {
        return null
    }
    return rfc822(dayjs(match).utc(true).add(hourOffset, "hour"))
}

const none: Array<never> = []
