<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { usePost, usePrevNext, useTaxonomyLinks } from '@vuemo/core/client'
import PostInfo from '../components/PostInfo.vue'
import PluginSlot from '../components/PluginSlot.vue'
import LogMeta from '../components/LogMeta.vue'
import Toc from '../components/Toc.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import BailOut from '../components/BailOut.vue'
import { usePalette } from '../composables'

const { frontmatter } = useData()
const post = usePost()
const adjacent = usePrevNext()
const { tagLink } = useTaxonomyLinks()
// the trigger palette adds a metadata line, a table of contents, the reading progress and a back-to-top button
const palette = usePalette()
</script>

<template>
  <article class="theme-container pt-8 pb-16">
    <ReadingProgress v-if="palette === 'trigger'" />
    <header class="grid">
      <h1 class="mb-2 justify-self-center font-bold text-xl sm:text-2xl text-(color:--tr-accent-strong)">
        {{ frontmatter.title }}
      </h1>
      <LogMeta v-if="post && palette === 'trigger'" class="justify-self-center" :post="post" />
      <PostInfo v-else-if="post" class="justify-self-center" :date="post.date.string" :category="post.category" />
    </header>
    <template v-if="palette === 'trigger'">
      <Toc variant="inline" />
      <aside class="tr-post-aside"><Toc variant="aside" /></aside>
    </template>
    <slot name="post-before-content" />
    <PluginSlot name="post-before-content" />
    <Content class="vuemo-content vp-doc" />
    <slot name="post-after-content" />
    <PluginSlot name="post-after-content" />
    <footer v-if="post">
      <div class="flex flex-wrap justify-center">
        <a v-for="tag in post.tags" :key="tag" :href="tagLink(tag)" class="justify-self-center text-(color:--tr-text-muted) my-1">
          <span class="theme-badge">{{ tag }}</span>
        </a>
      </div>
      <nav class="mt-5 md:flex" aria-label="Previous and next post">
        <div class="text-center my-3 md:my-0 md:w-1/2">
          <a v-if="adjacent.prev" class="theme-prev" :href="withBase(adjacent.prev.url)">Prev : {{ adjacent.prev.title }}</a>
        </div>
        <div class="text-center my-3 md:my-0 md:w-1/2">
          <a v-if="adjacent.next" class="theme-next" :href="withBase(adjacent.next.url)">Next : {{ adjacent.next.title }}</a>
        </div>
      </nav>
    </footer>
    <slot name="post-comments" />
    <PluginSlot name="post-comments" />
    <BailOut v-if="palette === 'trigger'" />
  </article>
</template>
