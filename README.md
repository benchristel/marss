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

### Command Line Syntax

```sh
marss INPUTFILE OUTPUTFILES...
```

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

An explanation of this format follows.

### Top-Level Heading

e.g. `# Recent Updates`

The level-1 heading is only for the human-readable
HTML changelog. It won't appear in the generated RSS feed.

### Feed Metadata Comment

e.g. `<!-- @marss ... -->`

Before `marss` can generate your RSS feed, you need to tell it some
metadata about the feed. You can configure this metadata in an HTML
comment that begins with `@marss`.
The comment can appear anywhere in the document.
The metadata format is similar to that of HTTP headers: it is a set of
newline-separated key-value pairs, where the key and value are separated by
a colon.

Example:

```html
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
```

`title`, `link`, and `description` are required; the other fields are
optional. See the [RSS 2.0 spec](https://cyber.harvard.edu/rss/rss.html) for
information about each field.

<details>
<summary>Examples of valid and invalid feed metadata comments</summary>

```html
This config is VALID because it has all the required fields.

<!--
@marss
title: The Website of Winnie the Pooh
link: https://example.com
description: A bear of very little brain.
-->
```

```html
This config is VALID. No space is required before the `@marss`
directive.

<!--@marss
title: ...
link: https://example.com
description: ...
-->
```

```html
This config is VALID. Additional newlines and spaces before the
`@marss` directive are allowed.

<!--
  
  @marss
title: ...
link: https://example.com
description: ...
-->
```

```html
This config is VALID because lines that are not formatted as key-value
pairs are ignored. Putting `#` or `//` at the beginning of a line will
always cause it to be ignored.

<!--
@marss
# this is a comment
# title: this line is ignored
title: ...
link: https://example.com
description: ...
-->
```

```html
This config is VALID because extra spaces around `:` or at the
beginning of a line are ignored.

<!--
@marss
  title  : The Website of Winnie the Pooh
  link  : https://example.com
  description  : A bear of very little brain.
-->
```

</details>

### Feed Items

Each item or entry in the feed begins with a level-2 heading. If there is a date in
the heading, in the format `YYYY-MM-DD`, it will be used as the publication
date of that item. Marss assumes that level-2 headings are unique within the
feed, and may do awkward things if it encounters duplicate headings.

### Markdown Format

Marss uses [`marked`](https://marked.js.org) as the markdown parser / HTML generator. These plugins are included:

- `marked-gfm-heading-id`

## Output Formats

The output file paths may have `.rss`, `.xml`, or `.html` extensions. If the
extension of a file is `.html`, an HTML feed will be written to that file;
otherwise, an RSS 2.0 feed will be written.

Note that the HTML output will be the bare HTMLified Markdown; i.e. it won't
be wrapped in `<html>` or `<body>` tags. You should pass the HTML through a
templating system of some sort before publishing it.

### Why use `marss` to generate HTML changelogs?

It might seem redundant to have `marss` convert Markdown to HTML - won't your
static site generator do that on its own? However, letting `marss` generate
the HTML ensures that the heading IDs in the HTML will be the same as the
ones in the RSS, so links to those headings from the RSS feed will work.

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

- Add `location` config field and add links to headings
- let user configure a timezone for dates

</details>
