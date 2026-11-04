# Assets

Every graphic or font that ships with the theme, with its author and licence.

| File | What | Author | Licence | Origin |
| --- | --- | --- | --- | --- |
| `src/assets/hex-grid.svg` | a plain hexagon tiling (28 x 48 px tile), used as a very faint card texture through a CSS mask | laplacetw | MIT | original work, drawn for this repository from the geometry of a regular hexagon grid |
| `src/assets/divider-node.svg` | a small hexagon outline with a dot, the node on a divider line | laplacetw | MIT | original work, drawn for this repository |
| `src/components/BailOut.vue` | the back-to-top button: a flat-topped hexagon outline (inline SVG) | laplacetw | MIT | original work, drawn for this repository from the geometry of a regular hexagon |
| `src/components/SignalTag.vue` | a small solid cube turned 45 degrees: three faces (inline SVG) | laplacetw | MIT | original work |
| nav corner (`.VPNavBar::before/::after` in `src/style-anime.css`) | a 1px line ending in a clipped triangle | laplacetw | MIT | original work, CSS only (no image) |
| card brackets (`.theme-card::before` in `src/style-anime.css`) | four L-shaped corner marks drawn with gradients | laplacetw | MIT | original work, CSS only (no image) |

The SVGs were drawn for this repository with AI assistance (Claude). The geometry is original: a regular hexagon tiling and a hexagon outline with a centre dot; nothing was traced from, or modelled on, any third-party artwork.

The same SVG content is inlined in `src/style-anime.css` (as mask data URIs, so the style's colours apply); `test/assets.test.ts` checks that the files and the CSS stay identical.

Fonts: none are bundled. The theme uses the system and VitePress font stacks. A font added later must be under the SIL Open Font License (OFL) or be a system font, and gets a row here.

Rules for anything added:

- original work only: drawn in this repository, or taken from a source whose licence allows this use, with the licence named in the table
- no official artwork, logos, emblems or character likenesses of any third-party work, and nothing traced from them; hexagons appear only as plain geometry (a faint grid, a cut corner), never composed into an emblem-like badge
- no character names anywhere; the labels of the anime style borrow only general concepts (a log, a briefing, bailing out) as plain words, all in `src/flavor.ts`, and `themeConfig.flavor: false` replaces them with neutral words
- apart from those labels and the single disclaimer sentence in the README, no names or titles from a third-party work in code, class names, comments or documentation
