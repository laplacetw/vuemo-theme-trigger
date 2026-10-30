<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { usePost, usePrevNext } from '@vuemo/core/client'
import LogMeta from '../../components/LogMeta.vue'
import PluginSlot from '../../components/PluginSlot.vue'
import TriggerSlots from '../../components/TriggerSlots.vue'
import ReadingProgress from '../../components/ReadingProgress.vue'
import BailOut from '../../components/BailOut.vue'
import Toc from '../../components/Toc.vue'

const { frontmatter } = useData()
const post = usePost()
const adjacent = usePrevNext()
</script>

<template>
  <div class="tr-post">
    <ReadingProgress />
    <article class="tr-post-main">
      <header class="tr-post-head">
        <LogMeta v-if="post" :post="post" category />
        <h1>{{ frontmatter.title }}</h1>
      </header>
      <Toc variant="inline" />
      <slot name="post-before-content" />
      <PluginSlot name="post-before-content" />
      <Content class="vuemo-content vp-doc" />
      <slot name="post-after-content" />
      <PluginSlot name="post-after-content" />
      <footer v-if="post" class="tr-post-foot">
        <TriggerSlots :tags="post.tags" />
        <nav class="tr-prevnext" aria-label="Previous and next post">
          <a v-if="adjacent.prev" :href="withBase(adjacent.prev.url)"><span class="tr-label">← Prev</span>{{ adjacent.prev.title }}</a>
          <a v-if="adjacent.next" class="tr-next" :href="withBase(adjacent.next.url)"><span class="tr-label">Next →</span>{{ adjacent.next.title }}</a>
        </nav>
      </footer>
      <slot name="post-comments" />
      <PluginSlot name="post-comments" />
    </article>
    <aside class="tr-post-aside">
      <Toc variant="aside" />
    </aside>
    <BailOut />
  </div>
</template>
