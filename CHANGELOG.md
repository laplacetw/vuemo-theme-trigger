# Changelog

## 2.0.0-alpha.2

Works with `@vuemo/core` 0.1.0-alpha.2; the About layout, reading time and the `/categories` default need 0.1.0-alpha.3.

### Features
- `layout: about`, the About layout of the Vuemo theme contract (since `@vuemo/core` 0.1.0-alpha.3): the About card (avatar and quote from `themeConfig.about`) above the page's own text. The example uses it. `<About />` in a page body still works
- `themeConfig.style: 'normal' | 'anime'`. The theme root carries `data-style`; an unknown value warns once and falls back to `'normal'`. The example switches with `STYLE=anime`
- style `'anime'`: navy and graphite surfaces, signal-cyan accent, light and dark, contrast-tested. Nav with an accent line and a clipped corner, `SignalTag` (a static solid cube turned 45 degrees, inline SVG, decorative, `aria-hidden`), tag/category badges with a cut corner and no frame, "Read more" with the 1.x ring and pulse, the AI summary as a bracketed panel with a console-style button, post cards with corner brackets and a faint hexagon texture, numbered h2 with an accent bar, dashed dividers with a hexagon node, thin scrollbar, code blocks with an accent edge, `::selection`, a 2px `:focus-visible` outline, reduced-motion support. It also adds a metadata line above post titles (`LOG-0042 · date · reading time · category`), a table of contents and a reading-progress line on posts, a hexagon back-to-top button (`緊急` / `脫出`, it jumps) and one post table for the archive, tags and categories pages. The `'normal'` style does not change
- `themeConfig.flavor` (default `true`): `false` replaces the style's own words with plain ones; all words are in `src/flavor.ts`
- reading time from `Post.words` (`@vuemo/core` 0.1.0-alpha.3); left out with an older core
- `ASSETS.md` lists every graphic (original work, MIT); the README has a name and credits section with the unofficial-fan-project disclaimer; `.github/PULL_REQUEST_TEMPLATE.md` has a checkbox that no official material was copied or traced

### Changes
- the README is shorter, starts with a quick start, and has Traditional and Simplified Chinese versions (`README.zh-TW.md`, `README.zh-CN.md`)
- the `@vuemo/*` devDependencies stay on `^0.1.0-alpha.2` until alpha.3 is on npm
- page titles (archive, tags, category, about) have room under the nav in both styles
- the example has a demo photo gallery page (built when `@vuemo/plugin-gallery` is installed)
- the back-to-top button moves keyboard focus to the site title, not to VitePress's skip link (which showed itself over the title)
- the category page's default title is `Categories`; the example's page is `categories.md` (`/categories`, the default path of `@vuemo/core` 0.1.0-alpha.3)
- `layout: page` content from `@vuemo/plugin-gallery` gets a centred container (max 72rem, 1rem padding) in both styles
- the colours live in `src/tokens.css` as semantic tokens (`--tr-accent`, `--tr-text-muted`, `--tr-border`, ...); the styles and components use the tokens instead of Tailwind colour names. The default look of Trigger's own parts is unchanged (a test pins every value)

### Fixes
- `--vp-c-brand-1` and `--vp-c-brand-3` in the `'normal'` style gave about 3.6:1 for VitePress links, inline code and the white text on buttons. They use cyan-700 now (about 5.3:1 on white), and dark mode defines its own button colour. **VitePress-owned colours changed**: links, inline code, buttons and tip blocks in the `'normal'` style are a darker cyan in light mode. Trigger's own parts keep their 1.x colours. Contrast tests cover both styles and both modes
- the accent of VitePress's own parts now follows Trigger's cyan. Trigger overrode the deprecated `--vp-c-brand`, `--vp-c-brand-light` ... variables, which VitePress 1.6 no longer reads, so VitePress buttons, tip blocks, links in the post body, inline code, the nav link highlight and the footer links stayed indigo. They are now driven by `--vp-c-brand-1/2/3/soft`. The border of a tip block is transparent in the `'normal'` style (VitePress 1.6's own value)

## 2.0.0-alpha.1

Install it the short way: `theme: 'trigger'`.

### Features
- `pnpm package` writes `dist-zip/vuemo-theme-trigger-<version>.zip` (top-level folder `trigger/` with `src`, `dist/style.css`, `package.json`, `README.md`, `LICENSE`) for people who unzip it into their blog's `themes/` folder
- `.github/workflows/release.yml` builds the zip and creates a GitHub prerelease when a tag `v*` is pushed

### Changes
- the peer dependency is now `@vuemo/core` `^0.1.0-alpha.2`: the zip flow and the short name `theme: 'trigger'` (from `themes/trigger/` or the installed `vuemo-theme-trigger`) need core >= alpha.2. With alpha.1 use the full package name, `theme: 'vuemo-theme-trigger'`
- the README installs with `npm install vuemo-theme-trigger` or from the zip, and names `vuemo.config.ts` as the user's config file
- `example/` keeps its settings in `example/vuemo.config.ts` with the boilerplate `.vitepress/config.ts` re-export, like a scaffolded blog
- the `@vuemo/*` devDependencies stay on `^0.1.0-alpha.1` until alpha.2 is on npm

## 2.0.0-alpha.0

Trigger is now a theme for [Vuemo](https://github.com/laplacetw/vuemo) (a blog framework on VitePress) instead of a "clone and edit" project. See the README for the migration table.

### Fixes
- the Archive, Category and Tag post links underline in cyan on hover (not the gray/white text color), as in 1.x
- the AI summary is styled through the plugin's class hooks (dashed box, yellow button, bouncing dots) and matches the 1.x look

### Breaking changes
- the repo is a theme package (`vuemo-theme-trigger`), not a blog: the old `.vitepress/`, `posts/`, `public/`, `tailwind.config.js`, `postcss.config.js` and `npm run new` are gone (`vuemo new <name>` replaces the script)
- settings moved from `.vitepress/theme/config.ts` to `defineBlogConfig` in `.vitepress/config.ts`
- requires `@vuemo/core` `^0.1.0-alpha.0`, VitePress `^1.6.0`
- Tailwind CSS v4 (compiled to `dist/style.css`, no preflight); users do not need Tailwind
- no runtime dependencies (the heroicons chevrons are inline SVG)

### Features
- layouts `home`, `post`, `archive`, `tag`, `category` (plus VitePress's `page`), registered as global components; the post body is `<Content class="vuemo-content vp-doc">` and the standard plugin slots are provided
- pagination with `usePagination` (`?page=`), summaries (`summary: 'excerpt' | 'description'`), prev/next links, tag and category links that preselect through `?tag=` / `?category=`
- `themeConfig.about { avatar?, quote? }` for the About page, with the exported `TriggerThemeConfig` type and `console.warn` validation
- search, comments (Utterances, Giscus) and the AI summary come from `search`, `comments` and `aiSummary` in `defineBlogConfig`

### Removed
- client-side JSON-LD (core emits it, with `dateModified`)
- the hand-written Utterances and AI summary components (use the official plugins)
- MathJax mobile workaround (VitePress fixed it)

### Accessibility and tooling
- headings: post and page titles are `<h1>`; archive, tag and category lists are `<ul>` of links instead of invalid `<dl>`; post info is a plain paragraph
- "Read more" links carry the post title for screen readers; redundant `aria-label`s removed
- `.theme-title` meets 4.5:1 contrast in light mode; the "Read more" pulse only runs with `motion-safe`
- an invalid `themeConfig.about` warns once per session
- `typecheck` script (`vue-tsc`), `prepack` builds `dist/style.css`, a GitHub Pages workflow (disabled until `@vuemo/*` is on npm)

## 1.x (dates are release dates)

# 2025-04-15

### Features
- add SummaryAI.vue

# 2025-02-22

### Features
- bump to vitepress@1.6.3

# 2024-11-25

### Features
- bump to vitepress@1.5.0

# 2024-09-08

### Features
- bump to vitepress@1.3.4

### Bug Fixes
- wrong link of post info

# 2024-06-09

### Features
- bump to vitepress@1.2.3
- remove styles of MathJax style optimization for mobile ([#3914](https://github.com/vuejs/vitepress/issues/3914#issuecomment-2138527325))

# 2024-04-16

### Features
- bump to vitepress@1.1.0
- add JSON-LD for SEO

# 2024-03-26

### Features
- bump to vitepress@1.0.1

# 2024-02-24

### Features
- bump to vitepress@1.0.0-rc.44

Note: there are [breaking changes of 1.0.0-rc.41 & 1.0.0-rc.43](https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md)

### Bug Fixes
- wrong datetime of new post template

# 2024-01-27

### Features
- bump to vitepress@1.0.0-rc.40

# 2024-01-07

### Features
- bump to vitepress@1.0.0-rc.35
- add [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)

# 2023-12-30

### Features
- bump to vitepress@1.0.0-rc.33
- bump to postcss@8.4.32
- add description to subpages

# 2023-11-11

### Features
- bump to vitepress@1.0.0-rc.25

# 2023-10-19

### Features
- bump to vitepress@1.0.0-rc.22
- [local search optimization](https://github.com/vuejs/vitepress/pull/2770#issuecomment-1685380396)
- using \<span\> as pagination buttons instead of \<a\>

# 2023-10-17

### Bug Fixes
- history call without withBase() lead to wrong index

# 2023-10-15

### Bug Fixes
- wrong link of post tags due to siteConfig.base

# 2023-10-14

### Bug Fixes
- url error with siteConfig.base

# 2023-10-13

### Features
- add workflow for deploy to GitHub pages

# 2023-10-04

### Features
- add script for create new post

# 2023-10-01

### Features
- truncate excerpt
- optimize style of category / tag

# 2023-09-28

### Bug Fixes
- hide prev / next at latest / oldest post