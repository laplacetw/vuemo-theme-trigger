import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { runEnhanceApps } from '@vuemo/core/client'
import TriggerLayout from './TriggerLayout.vue'
import About from './components/About.vue'
import Post from './layouts/Post.vue'
import Archive from './layouts/Archive.vue'
import Tag from './layouts/Tag.vue'
import Category from './layouts/Category.vue'
import AboutLayout from './layouts/About.vue'
import '../dist/style.css'

export type { TriggerThemeConfig, Palette } from './types'

// Trigger builds on VitePress's default theme (nav, search, footer, dark mode toggle). VitePress renders
// `<component :is="frontmatter.layout">` for a layout it does not know, so global components act as layouts.
const theme: Theme = {
  extends: DefaultTheme,
  Layout: TriggerLayout,
  enhanceApp(ctx) {
    ctx.app.component('post', Post)
    ctx.app.component('archive', Archive)
    ctx.app.component('tag', Tag)
    ctx.app.component('category', Category)
    ctx.app.component('about', AboutLayout)
    // `<About />` in a page body: the About card of Trigger 2.0.0-alpha.1 and earlier (now `layout: about`)
    ctx.app.component('About', About)
    // Contract: plugins (comments, AI summary, ...) register their client code through this
    return runEnhanceApps(ctx)
  }
}

export default theme
