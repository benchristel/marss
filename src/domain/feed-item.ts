import {parseDocument} from "htmlparser2"
import render from "dom-serializer"
import type {ChildNode, Element} from "domhandler"
import {getAttributeValue, innerText} from "domutils"
import {rfc822} from "../language/date.js"
import {dateRegex} from "./feed-item-date.js"
import dayjs from "dayjs"
import {isAnchor, isAudio, isH2, isImg, isSource} from "../lib/dom.js"

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
        // TODO: can publishAtUtcHour be made required? It defaults to 0 in the config
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
                    const descriptionNodes = getDescriptionNodes(node)
                    if (htmlUrl) for (const descNode of descriptionNodes) {
                        fullyQualifyUrlsInPlace(descNode, htmlUrl)
                    }
                    return {
                        title,
                        description: render(descriptionNodes).trim(),
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

function fullyQualifyUrlsInPlace(node: ChildNode, baseUrl: string): void {
    recursivelyTransformUrlAttributesInPlace(node, (urlAttribute) => {
        return new URL(urlAttribute, baseUrl).toString()
    })
}

function recursivelyTransformUrlAttributesInPlace(
    node: ChildNode,
    fn: (urlAttribute: string) => string,
): ChildNode {
    if (isAnchor(node) && node.attribs.href) {
        node.attribs.href = fn(node.attribs.href)
    }
    if (isMediaSource(node) && node.attribs.src) {
        node.attribs.src = fn(node.attribs.src)
    }
    if (node.type === "tag") for (const child of node.children) {
        recursivelyTransformUrlAttributesInPlace(child, fn)
    }
    return node
}

function isMediaSource(node: ChildNode): node is Element {
    return isImg(node) || isAudio(node) || isSource(node)
}

const none: Array<never> = []
