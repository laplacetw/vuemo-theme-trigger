/// <reference types="@vuemo/plugin-comments" />
/// <reference types="@vuemo/plugin-ai-summary" />
import { fileURLToPath } from 'node:url'
import { defineBlogConfig } from '@vuemo/core'
import footnote from 'markdown-it-footnote'
import type { TriggerThemeConfig } from '../../src'

const themeConfig: TriggerThemeConfig = {
  about: { avatar: '/avatar.png', quote: 'Trigger your blog !' }
}

export default defineBlogConfig({
  // site
  title: 'Trigger !',
  description: 'A blog powered by Vuemo',
  lang: 'en',
  base: process.env.BASE ?? '/',
  hostname: 'https://example.com',
  appearance: 'dark',
  cleanUrls: true,
  head: [['link', { rel: 'icon', href: `${process.env.BASE ?? '/'}favicon.png` }]],
  lastUpdated: true,
  search: true,

  // theme: the absolute path of the theme entry works like a package name
  theme: fileURLToPath(new URL('../../src/index.ts', import.meta.url)),
  logo: '/avatar.png',
  postsPerPage: 2,
  nav: [
    { text: '🏠 Home', link: '/' },
    { text: '📚 Archives', link: '/archives' },
    { text: '📁 Category', link: '/category' },
    { text: '🔖 Tags', link: '/tags' },
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
  comments: { provider: 'utterances', repo: 'laplacetw/vitepress-theme-trigger', dark: 'gruvbox-dark' },
  // points at nothing on purpose: clicking the button shows the fetch error
  aiSummary: { api: 'http://127.0.0.1:9/summary' }
})
