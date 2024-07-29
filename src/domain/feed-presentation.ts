import {Item} from "./feed-item.js"

export type FeedPresentation = {
    title: string;
    link: string;
    description: string;
    language: string | null;
    copyright: string | null;
    imageUrl: string | null;
    managingEditor: string | null;
    webMaster: string | null;
    ttl: string | null;
    items: Item[];
}
