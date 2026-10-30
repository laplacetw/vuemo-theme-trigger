<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { useTags, useQueryParam } from '@vuemo/core/client'
import { dotDate } from '../../composables'

const { frontmatter } = useData()
const tags = useTags()
// the selected tag lives in the URL (?tag=...), so tag links on posts preselect it
const selected = useQueryParam('tag')
</script>

<template>
  <div class="tr-page">
    <header class="tr-page-head">
      <h1>{{ frontmatter.title || 'Tags' }}</h1>
    </header>
    <ul class="tr-slots tr-slots-all">
      <li v-for="(list, tag) in tags" :key="tag">
        <a
          class="tr-slot"
          :href="`?tag=${encodeURIComponent(String(tag))}`"
          :aria-current="selected === String(tag) ? 'true' : undefined"
          @click.prevent="selected = String(tag)"
        >
          <span class="tr-slot-text">{{ tag }}</span><span class="tr-count">{{ list.length }}</span>
        </a>
      </li>
    </ul>
    <section v-if="selected && Object.hasOwn(tags, selected)" class="tr-selection">
      <h2 class="tr-label">{{ selected }}</h2>
      <ul class="tr-rows">
        <li v-for="post in tags[selected]" :key="post.url">
          <a :href="withBase(post.url)">
            <span class="tr-code">{{ dotDate(post.date.string) }}</span>
            <span class="tr-squad-name">{{ post.title }}</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
