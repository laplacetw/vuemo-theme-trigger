/// <reference types="@vuemo/plugin-comments" />
/// <reference types="@vuemo/plugin-ai-summary" />
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { defineBlogConfig } from '@vuemo/core'
import footnote from 'markdown-it-footnote'
import type { TriggerThemeConfig } from '../src'

// `STYLE=anime pnpm dev` shows the other style
const themeConfig: TriggerThemeConfig = {
  style: process.env.STYLE === 'anime' ? 'anime' : 'normal',
  about: { avatar: '/avatar.png', quote: 'Trigger your blog !' }
}

// The photo gallery (@vuemo/plugin-gallery, a small demo album stored in public/gallery) is on when the plugin is
// installed; without it the gallery page is left out
const hasGallery = (() => {
  try {
    createRequire(import.meta.url).resolve('@vuemo/plugin-gallery')
    return true
  } catch {
    return false
  }
})()
const gallery: Record<string, unknown> = hasGallery
  ? { gallery: { storage: 'local', widths: [320, 640], perPage: 6 } }
  : { srcExclude: ['gallery.md'] }

export default defineBlogConfig({
  // site
  title: 'Trigger !',
  description: 'A blog powered by Vuemo',
  lang: 'en',
  base: process.env.BASE ?? '/',
  hostname: 'https://example.com',
  appearance: 'dark',
  cleanUrls: true,
  // the build test writes elsewhere, so it does not touch a dist you are looking at
  ...(process.env.OUT_DIR ? { outDir: process.env.OUT_DIR } : {}),
  lastUpdated: true,
  search: true,

  // theme: the absolute path of the theme entry works like a package name
  theme: fileURLToPath(new URL('../src/index.ts', import.meta.url)),
  // the default since @vuemo/core 0.1.0-alpha.3; written out for older cores
  paths: { category: '/categories' },
  logo: '/avatar.png',
  postsPerPage: 2,
  nav: [
    { text: '🏠 Home', link: '/' },
    { text: '📚 Archives', link: '/archives' },
    { text: '📁 Categories', link: '/categories' },
    { text: '🔖 Tags', link: '/tags' },
    ...(hasGallery ? [{ text: '📷 Gallery', link: '/gallery' }] : []),
    { text: '🙆 About', link: '/about' }
  ],
  socialLinks: [{ icon: 'github', link: 'https://github.com/laplacetw' }],
  footer: {
    message:
      "Powered by <a target='_blank' href='https://github.com/laplacetw/vuemo'>Vuemo</a> Theme by <a target='_blank' href='https://github.com/laplacetw/vuemo-theme-trigger'>Trigger</a>",
    copyright:
      "<a target='_blank' href='https://creativecommons.org/licenses/by/4.0/'>CC BY 4.0</a> | © Trigger " +
      new Date().getFullYear()
  },

  // Trigger's own options
  themeConfig,

  // Markdown: math, line numbers and footnotes are VitePress / markdown-it features
  markdown: {
    math: true,
    lineNumbers: true,
    config: (md) => {
      md.use(footnote)
    }
  },

  // features
  ...gallery,
  comments: {
    provider: 'giscus',
    repo: 'laplacetw/vuemo-comments',
    repoId: 'R_kgDOVS5AXA',
    category: 'Announcements',
    categoryId: 'DIC_kwDOVS5AXM4DJmFA',
    dark: 'gruvbox_dark'
  },
  // points at nothing on purpose: clicking the button shows the fetch error
  aiSummary: { api: 'http://127.0.0.1:9/summary' }
})
