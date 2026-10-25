<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { usePost, usePrevNext, useTaxonomyLinks } from '@vuemo/core/client'
import PostInfo from '../components/PostInfo.vue'
import PluginSlot from '../components/PluginSlot.vue'

const { frontmatter } = useData()
const post = usePost()
const adjacent = usePrevNext()
const { tagLink } = useTaxonomyLinks()
</script>

<template>
  <article class="theme-container pt-8 pb-16">
    <header class="grid">
      <h1 class="mb-2 justify-self-center font-bold text-xl sm:text-2xl text-cyan-700 dark:text-cyan-100">
        {{ frontmatter.title }}
      </h1>
      <PostInfo v-if="post" class="justify-self-center" :date="post.date.string" :category="post.category" />
    </header>
    <slot name="post-before-content" />
    <PluginSlot name="post-before-content" />
    <Content class="vuemo-content vp-doc" />
    <slot name="post-after-content" />
    <PluginSlot name="post-after-content" />
    <footer v-if="post">
      <div class="flex flex-wrap justify-center">
        <a v-for="tag in post.tags" :key="tag" :href="tagLink(tag)" class="justify-self-center text-gray-500 dark:text-gray-300 my-1">
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
  </article>
</template>
