# Assets

Every graphic or font that ships with the theme, with its author and licence.

| File | What | Author | Licence | Origin |
| --- | --- | --- | --- | --- |
| `src/assets/hex-grid.svg` | a plain hexagon tiling (28 x 48 px tile), used as a very faint card texture through a CSS mask | laplacetw | MIT | original work, drawn for this repository from the geometry of a regular hexagon grid |
| `src/assets/divider-node.svg` | a small hexagon outline with a dot, the node on a divider line | laplacetw | MIT | original work, drawn for this repository |
| `src/components/TriggerChip.vue` | a rectangle with one cut corner and an LED dot (CSS shapes, no image) | laplacetw | MIT | original work |

The same SVG content is inlined in `src/palette-trigger.css` (as mask data URIs, so the palette's colours apply); `test/assets.test.ts` checks that the files and the CSS stay identical.

Fonts: none are bundled. The theme uses the system and VitePress font stacks. A font added later must be under the SIL Open Font License (OFL) or be a system font, and gets a row here.

Rules for anything added:

- original work only: drawn in this repository, or taken from a source whose licence allows this use, with the licence named in the table
- no official artwork, logos, emblems or character likenesses of any third-party work, and nothing traced from them; hexagons appear only as plain geometry (a faint grid, a cut corner), never composed into an emblem-like badge
- no names, titles or terms from a third-party work in code, class names, comments or documentation (the single disclaimer sentence in the README is the exception)
