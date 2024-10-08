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
htmlUrl: https://example.com/changelog.html
publishAtUtcHour: 12
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

## Wondering about Woozles, 2021-09-22

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

Each item or entry in the feed begins with a level-2 heading. If there is a
date in the heading, it will be used as the publication date of that item.
The recognized date formats are:

- `2024-08-14`
- `August 14, 2024` (comma optional)
- `Aug 14, 2024` (3-letter abbreviation, comma optional)

It's a good idea to include dates or incrementing numbers in your headings.
Marss assumes that level-2 headings are unique within the feed, and may do
awkward things if it encounters duplicate headings.

### Setting the publication time

You can set the publication time (in hours after midnight UTC) of each feed
item by adding the `publishAtUtcHour` field to your `@marss` metadata. For
example:

```
<!--
@marss
...
# Posts will have their pubDate set to 3 AM UTC
publishAtUtcHour: 3
-->
```

If `publishAtUtcHour` is not set, the publication time will default to
midnight UTC on the date specified in the feed item heading.

<details>
<summary><h3>Why would you want to set the pubDate?</h3></summary>

Feed readers typically display publication dates in the reader's local
timezone. Using midnight UTC as the publication time might cause that local
date to be inconsistent with the heading of the feed item for some of your
readers.

For example, a feed item whose publication date is midnight, January 1st in
UTC will appear to have been published on December 31st to readers in
California.

To ensure the date is displayed consistently in (almost) every timezone, you
can publish at noon UTC by setting `publishAtUtcHour: 12`. The downside is
that your posts will not appear in some feed readers until that hour; i.e.
users in England will not see your posts until noon their time, even if you
update your feed before noon.

You can set `publishAtUtcHour` to a negative value, which will subtract that
many hours from `pubDate`. In effect, it will set `pubDate` to the UTC date
prior to the date specified in the feed item heading.

If this all seems too complicated, feel free to ignore it. Nothing will break
if you don't set `publishAtUtcHour`.

</details>

### `htmlUrl` and links to feed items

Most RSS readers will display, alongside or in the heading of each feed
item, a link to the original article. This makes it easy for users to read
the article in their web browser if they choose.

In order for this to work with `marss`-generated feeds, you need to do two
things:

- Add an `htmlUrl` field to your `@marss` metadata. The `htmlUrl` should be
  the fully-qualified URL of the HTML version of your changelog or microblog.
- Use `marss` to convert your markdown changelog to HTML, as described in
  "Output Formats" below.

If you have done both of these things, marss will link each feed item to its
corresponding level-2 heading in the HTML changelog.

### Markdown Format

Marss uses [`marked`](https://marked.js.org) as the markdown parser / HTML generator. These plugins are included:

- `marked-gfm-heading-id`

## Output Formats

You may specify any number of output file paths on the command line, e.g.

```bash
marss input.md output/rss.xml output/changelog.html
```

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

</details>
