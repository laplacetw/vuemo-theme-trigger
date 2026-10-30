# Assets

Every graphic or font that ships with the theme, with its author and licence.

| File | What | Author | Licence | Origin |
| --- | --- | --- | --- | --- |
| `src/components/Gate.vue` | the 404 page: a plain black circle with a hairline edge (inline SVG) | laplacetw | MIT | original work, simple geometry |
| corner mark (`.tr-mark::before` in `src/palette-trigger.css`) | a small square corner at the top left of a block, drawn with two borders | laplacetw | MIT | original work, CSS only (no image) |

The palette ships no image files. The shapes were drawn for this repository with AI assistance (Claude); nothing was traced from, or modelled on, any third-party artwork.

Fonts: none are bundled and none are downloaded. The trigger palette names "Noto Sans TC" and "JetBrains Mono" (both SIL Open Font License) first in its font stacks, so they are used only when the reader has them installed; otherwise the system fonts are. A font added later must be under the SIL Open Font License (OFL) or be a system font, and gets a row here.

Rules for anything added:

- original work only: drawn in this repository, or taken from a source whose licence allows this use, with the licence named in the table
- no official artwork, logos, emblems, fonts, screenshots, quotes or character likenesses of any third-party work, and nothing traced from them
- no character names anywhere; the labels of the trigger palette borrow only general concepts (a log, a squad, a loadout slot, bailing out, a gate) as plain words, all in `src/flavor.ts`, and `themeConfig.flavor: false` replaces them with neutral words
- apart from those labels and the single disclaimer sentence in the README, no names or titles from a third-party work in code, class names, comments or documentation
