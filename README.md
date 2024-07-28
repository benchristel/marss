# marss

A Markdown-to-RSS feed generator for NodeJS.
Marss takes your Markdown changelog or microblog and creates an equivalent RSS feed.

It is intended for use alongside another static site generator that will convert the
changelog to human-readable HTML.

## CLI Quick Start

```sh
npx marss path/to/changelog.md path/to/feed.rss
```

This will read `path/to/changelog.md` and generate `path/to/feed.rss`.

## Markdown Changelog Format

### Example

```markdown
# Recent Updates

<!--
@marss
title: The Website of Winnie the Pooh
link: https://example.com
description: A bear of very little brain.
language: en-us
copyright: Copyright 1926-2024, Edward Bear
imageUrl: https://example.com/88x31.gif
managingEditor: pooh@100acre.wood (Edward Bear)
webMaster: cr@100acre.wood (Christopher Robin)
ttl: 3600
-->

## 2022-05-06: Twelve Pots of Honey Left

This content will appear in the feed item's description.
It will be rendered as HTML, so it can contain **styled text**,
[links](#), and ![images](img.jpg).

## Thoughts on Woozles, 2021-09-22

More content...
```

### Explanation

The level-1 heading (`# Recent Updates` above) is only for the human-readable
HTML changelog. It won't appear in the generated RSS feed.

You can configure feed metadata in an HTML comment that begins with `@marss`.
The comment can appear anywhere in the document.
The data in the comment after the `@marss` directive is parsed as YAML.
`title`, `link`, and `description` are required; the other fields are
optional. See the [RSS 2.0 spec](https://cyber.harvard.edu/rss/rss.html) for
information about each field.

Each item in the feed begins with a level-2 heading. If there is a date in
the heading, in the format `YYYY-MM-DD`, it will be used as the publication
date of that item. Marss assumes that level-2 headings are unique within the
feed, and may do awkward things if it encounters duplicate headings.

The markdown parser used is [`marked`](https://marked.js.org), with these
plugins:

- `marked-gfm-heading-id`

## Development

<details>
<summary>This section is about working on the code for marss.</summary>

Opening the repo in VS Code will automatically run the typechecker and display errors
in the problems pane.

```bash
# typecheck in watch mode. You don't need to run this manually if you use VS Code.
yarn ts
# run unit tests
yarn test
# run system tests
yarn sys
# check formatting
yarn lint
# fix formatting
yarn fix
# run all checks (do this before you git push)
yarn verify
# compile to JS in dist/
yarn build
```

### TODO

- Add these channel-level attributes:
  ```
  ttl: 3600
  ```
- Parse dates from headings and set `pubDate`
- Generate HTML changelogs
- Add `location` config field and add links to headings

</details>
