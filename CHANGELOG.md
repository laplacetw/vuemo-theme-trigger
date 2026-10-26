# Changelog

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