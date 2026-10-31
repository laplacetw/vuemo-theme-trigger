# vuemo-theme-trigger

![](https://img.shields.io/github/license/laplacetw/vuemo-theme-trigger)
![Node.js >= 18.0.0](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green)

Trigger is a blog theme for [Vuemo](https://github.com/laplacetw/vuemo), the blog framework built on [VitePress](https://vitepress.dev). It is styled with Tailwind CSS (compiled for you, nothing to install). It builds on VitePress's default theme for the nav bar, search and footer.

> **Status: 2.0 alpha.** Vuemo is under development. Resolving `theme: 'trigger'` (below) needs `@vuemo/core` `^0.1.0-alpha.2` or newer.

![](./example/public/preview.png)

## Install

### With npm

```sh
npm install vuemo-theme-trigger
```

Run it in the root of your Vuemo blog, then set the theme in `vuemo.config.ts` (the config file in the project root of a blog made with `npm create vuemo`; older projects keep their settings in `.vitepress/config.ts`):

```ts
// vuemo.config.ts
import { defineBlogConfig } from '@vuemo/core'

export default defineBlogConfig({
  title: 'Trigger !',
  theme: 'trigger',
  appearance: 'dark',
  postsPerPage: 5,
  nav: [
    { text: '🏠 Home', link: '/' },
    { text: '📚 Archives', link: '/archives' },
    { text: '📁 Categories', link: '/categories' },
    { text: '🔖 Tags', link: '/tags' },
    { text: '🙆 About', link: '/about' }
  ],
  search: true,
  lastUpdated: true,
  themeConfig: { about: { avatar: '/avatar.png', quote: 'Trigger your blog !' } }
})
```

To update, run `npm install vuemo-theme-trigger@latest`.

### From a zip

Download `vuemo-theme-trigger-<version>.zip` from [GitHub Releases](https://github.com/laplacetw/vuemo-theme-trigger/releases) and unzip it into the `themes/` folder of your blog (create the folder if it is not there). The result is `themes/trigger/`. Then set `theme: 'trigger'` in `vuemo.config.ts`, as above. To update, replace the folder with the newer zip. The zip carries the compiled CSS, so there is nothing to build.

If both exist, `themes/trigger/` wins over the installed package.

### A new blog

```sh
npm create vuemo@alpha my-blog -- --theme trigger
```

creates a blog with the theme already set up.

Create the pages the nav points to, each with a layout in its frontmatter:

| File | Frontmatter | Body |
| --- | --- | --- |
| `index.md` | `layout: home` | |
| `archives.md` | `layout: archive` | |
| `tags.md` | `layout: tag` | |
| `categories.md` | `layout: category` | |
| `about.md` | `layout: about` | your text |

`npm create vuemo@alpha my-blog -- --theme trigger` already creates these files (`about.md` gets `layout: about`, a layout every Vuemo theme has). Trigger shows the About card (avatar and quote from `themeConfig.about`) above your text, so the page needs no component:

```md
---
title: About
layout: about
---

Any Markdown you write here is rendered under the card.
```

An `about.md` from 2.0.0-alpha.1 (`layout: page` with `<About />` in the body) still works; to switch, set `layout: about` and remove `<About />`, otherwise the card shows twice.

See [`example/`](./example) for a complete blog. Posts go in `posts/`; an excerpt is the part before a `---` line.

## What it supports

| Vuemo option | In Trigger |
| --- | --- |
| `nav`, `logo`, `socialLinks`, `footer`, `search`, `lastUpdated` | shown by VitePress's default theme parts |
| `postsPerPage`, `summary` | home page list: excerpt (or description) and "Read more", paginated with `?page=` |
| `paths` | tag and category links (`?tag=`, `?category=`) |
| `comments`, `aiSummary` | the official plugins, in the standard post slots |
| `markdown` (`math`, `lineNumbers`, `config`) | VitePress / markdown-it; the example turns on math, line numbers and footnotes |

### Theme options (`themeConfig`)

| Option | Type | Meaning |
| --- | --- | --- |
| `about.avatar` | `string` | avatar of the About page: a file in `public/` or a URL (none by default) |
| `about.quote` | `string` | the line under it (default `Trigger your blog !`) |
| `palette` | `'default'` \| `'trigger'` | the look (default `'default'`, the look of 1.x) |
| `flavor` | `boolean` | `'trigger'` palette only: the theme's own words (default `true`), or plain ones with `false` |

The type `TriggerThemeConfig` is exported; a wrong value prints a `console.warn('[vuemo-theme-trigger] ...')` once and the theme falls back to the default.

### Palettes

`themeConfig.palette` picks the colours:

```ts
export default defineBlogConfig({
  theme: 'trigger',
  themeConfig: { palette: 'trigger' }
})
```

| Palette | Look |
| --- | --- |
| `'default'` | the look of Trigger 1.x: white and dark surfaces, cyan links, Tailwind's cyan to blue title |
| `'trigger'` | an operations-console look: graphite and navy surfaces, a signal-cyan accent, thin hairlines. Light and dark mode. Nav with an accent line and a clipped corner, a small solid cube before post metadata, post cards with corner brackets and a faint hexagon texture, numbered `h2` in posts, dashed dividers with a small hexagon node, cut-corner tag badges without a frame, the AI summary as a bracketed panel with a console-style button, a thin scrollbar and accent-edged code blocks |

The `'trigger'` palette also adds:

- a monospace metadata line above post titles (home and post): `LOG-0042 · 2026.10.30 · 6 MIN · Category`
- on posts, a table of contents (beside the post from 1280px, with the current section marked; collapsed above the post before that), a 2px reading-progress line at the top, and a hexagon back-to-top button (`緊急` / `脫出`) that jumps to the top
- an archive table (date, number, title, category); the tags and categories pages list the posts of the selected tag or category in the same table

Reading time needs `@vuemo/core` 0.1.0-alpha.3 or later; with an older core it is left out. `themeConfig.flavor: false` replaces the theme's own words (`LOG-`, `緊急脫出`, `BRIEFING`) with plain ones (`No.`, `TOP`, `Contents`); they are all in [`src/flavor.ts`](./src/flavor.ts).

Both palettes follow VitePress's dark mode (`appearance`, the toggle in the nav). The `'trigger'` palette respects `prefers-reduced-motion` and keeps text at 4.5:1 and borders and the focus ring at 3:1 or more (checked by `pnpm test`, including VitePress's links, inline code and buttons in both palettes).

The colours are semantic tokens (`--tr-accent`, `--tr-surface-0`, `--tr-text-muted`, `--tr-border`, `--tr-focus`, ...) in [`src/tokens.css`](./src/tokens.css), mapped to VitePress's variables (`--vp-c-brand-1/2/3/soft`, and under the `'trigger'` palette `--vp-c-bg`, `--vp-c-divider`, `--vp-code-block-bg`, ...) so VitePress's own buttons, tip blocks, links and search follow the accent. A new palette is a new set of values for these tokens.

In `example/`, `PALETTE=trigger pnpm dev` (or `pnpm build:example`) shows the `'trigger'` palette.

### Photo gallery

[`@vuemo/plugin-gallery`](https://github.com/laplacetw/vuemo) works with Trigger without extra code:

1. install it and enable it in `vuemo.config.ts` (`gallery: { baseUrl: '...' }`)
2. add `gallery.md` with `layout: page` and `<VuemoGallery />` as the body

Trigger centres the gallery in a container (max 72rem) and, under the `'trigger'` palette, maps the plugin's CSS variables to its tokens: `--vuemo-gallery-radius` to `--tr-radius`, `--vuemo-gallery-bg` to `--tr-surface-1` and `--vuemo-gallery-focus` to `--tr-focus`. Without them the plugin uses VitePress's variables, which follow the accent in both palettes. Override any `--vuemo-gallery-*` variable in your own CSS to change it.

## Migrating from 1.x

Trigger 1.x was a repository you cloned and edited. 2.0 is a package; your posts stay as they are.

| 1.x | 2.0 |
| --- | --- |
| clone this repo | `pnpm add vuemo-theme-trigger` in a Vuemo blog (`npm create vuemo`) |
| `.vitepress/theme/config.ts` | `defineBlogConfig` in `vuemo.config.ts` |
| `title`, `description`, `lang`, `base`, `appearance`, `cleanUrls`, `cacheDir`, `hostname` | the same names in `defineBlogConfig` (`hostname` also drives sitemap, RSS and JSON-LD) |
| `favicon` | `head: [['link', { rel: 'icon', href: '/favicon.png' }]]` |
| `logo`, `nav`, `socialLinks`, `footer`, `postsPerPage` | the same names in `defineBlogConfig` |
| `lastUpdated: true` | `lastUpdated: true` |
| `mdMath`, `mdLineNums` | `markdown: { math: true, lineNumbers: true }` |
| `markdown-it-footnote` set up in `config.ts` | `markdown: { config: (md) => md.use(footnote) }` (install `markdown-it-footnote`) |
| `utterances: { repo, issueTerm, light, dark }` | `comments: { provider: 'utterances', repo, ... }` ([`@vuemo/plugin-comments`](https://github.com/laplacetw/vuemo)); dark mode follows automatically |
| `cloudflareApi` | `aiSummary: { api: '<worker url>' }` ([`@vuemo/plugin-ai-summary`](https://github.com/laplacetw/vuemo)) |
| local search in `config.ts` | `search: true` |
| hard-coded About avatar and quote | `themeConfig.about { avatar, quote }` |
| `archives.md`: `<Archives />`, `tags.md`: `<Tags />`, `category.md`: `<Category />` | `layout: archive`, `layout: tag`, `layout: category` in the frontmatter, no body; with `@vuemo/core` 0.1.0-alpha.3 or later the category page is `categories.md` (`/categories`), or set `paths: { category: '/category' }` to keep `category.md` |
| `index.md`: `layout: home` | unchanged |
| posts in `posts/` | unchanged; `date`, `title`, `category`, `tags`, `description` (frontmatter schema of Vuemo) |
| `npm run new <name>` | `npx vuemo new <name>` |
| client-side JSON-LD | emitted at build time by Vuemo core (with `dateModified`) |
| pagination and tag/category state in a store (History API) | `?page=`, `?tag=`, `?category=` in the URL, so they can be linked and survive reloads |
| `.vitepress/theme/index.ts` with the theme code | the fixed one-liner `export { default } from '@vuemo/core/theme'` |
| Tailwind installed in your project | compiled into the theme (`dist/style.css`); nothing to install |
| `README_CH.md`, the Pages workflow | removed; use Vuemo's deployment guide |

## Develop the theme

```sh
pnpm install
pnpm build          # compile src/style.css to dist/style.css (Tailwind CSS v4)
pnpm dev            # the example blog
pnpm check          # vuemo check-theme: the theme contract
pnpm test           # includes the colour tokens: snapshot of the default palette, WCAG contrast of both
pnpm build:example  # PALETTE=trigger pnpm build:example for the other palette
pnpm package        # dist-zip/vuemo-theme-trigger-<version>.zip, the download for the `themes/` folder
```

`@vuemo/core` and the two plugins come from npm (`devDependencies`, still on `^0.1.0-alpha.1`, which the example needs to build; the peer dependency is `@vuemo/core` `^0.1.0-alpha.2`, the first release that resolves `theme: 'trigger'`). To develop against a local checkout of the Vuemo monorepo instead, temporarily point them at it with `link:../vuemo/packages/core`, `link:../vuemo/plugins/comments` and `link:../vuemo/plugins/ai-summary` (the monorepo must be built) and do not commit that change.

The example keeps its settings in `example/vuemo.config.ts`, like a scaffolded blog (`example/.vitepress/config.ts` only re-exports it).

Pushing a tag `v*` runs `.github/workflows/release.yml`, which builds the zip and attaches it to a GitHub prerelease.

The GitHub Pages workflow (`.github/workflows/pages.yml`) builds the example blog on every push to `main`.

`pnpm typecheck` runs `vue-tsc`.

## Name and credits

The name is a nod to the manga *World Trigger* by Daisuke Ashihara. This is an unofficial fan-made project, not affiliated with or endorsed by the author, Shueisha or Toei Animation.

The theme contains no official artwork, logos, character likenesses or other material from that work. The palette is inspired only by general motifs (a sci-fi control-room feel, HUD lines, hexagon geometry, a cool colour scheme) and a few general concepts as plain words (a log, a briefing, bailing out), all in `src/flavor.ts` and switched off with `flavor: false`. Every graphic is original work drawn in this repository under the MIT licence, listed in [ASSETS.md](./ASSETS.md); fonts are system fonts or OFL only. Contributions must follow the same rule (see the pull request template): nothing copied or traced from official material, no character names, and no other names or titles from the work in code, class names or documentation.

## License

MIT
