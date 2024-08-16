import type {ChildNode, Element} from "domhandler"

export function isH2(node: ChildNode): node is Element {
    return node.type === "tag" && node.name === "h2"
}

export function isAnchor(node: ChildNode): node is Element {
    return node.type === "tag" && node.name === "a"
}

export function isImg(node: ChildNode): node is Element {
    return node.type === "tag" && node.name === "img"
}

export function isAudio(node: ChildNode): node is Element {
    return node.type === "tag" && node.name === "audio"
}

export function isSource(node: ChildNode): node is Element {
    return node.type === "tag" && node.name === "source"
}
