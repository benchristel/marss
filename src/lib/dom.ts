import type {ChildNode} from "domhandler"

export function isH2(node: ChildNode): boolean {
    return node.type === "tag" && node.name === "h2"
}
