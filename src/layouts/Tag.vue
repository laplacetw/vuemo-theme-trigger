<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { useTags, useQueryParam } from '@vuemo/core/client'
import Title from '../components/Title.vue'
import PostTable from '../components/PostTable.vue'
import { usePalette } from '../composables'

const { frontmatter } = useData()
const tags = useTags()
// the selected tag lives in the URL (?tag=...), so tag links on posts preselect it
// the trigger palette lists the posts in the archive's table
const palette = usePalette()
const selected = useQueryParam('tag')
</script>

<template>
  <div class="theme-container">
    <Title :text="frontmatter.title || 'Tags'" />
    <div class="flex flex-wrap">
      <a
        v-for="(list, tag) in tags"
        :key="tag"
        class="px-2 my-1"
        :href="`?tag=${encodeURIComponent(String(tag))}`"
        @click.prevent="selected = String(tag)"
      >
        <span class="theme-badge">{{ tag }}</span>
        <sup>{{ list.length }}</sup>
      </a>
    </div>
    <hr class="h-px my-4 bg-(--tr-rule) border-0" />
    <template v-if="selected && Object.hasOwn(tags, selected)">
      <template v-if="palette === 'trigger'">
        <p id="tagName" class="pb-2 text-xl font-extrabold">{{ selected }} : {{ tags[selected].length }} {{ tags[selected].length === 1 ? 'post' : 'posts' }}</p>
        <PostTable :posts="tags[selected]" />
      </template>
      <template v-else>
        <h2 id="tagName" class="pb-2">🔖 {{ selected }}</h2>
        <ul>
          <li v-for="post in tags[selected]" :key="post.url">
            <a class="decoration-2 decoration-(color:--tr-accent) hover:underline flex justify-between my-3 text-base leading-6 font-medium text-(color:--tr-text-muted)" :href="withBase(post.url)">
              <span class="truncate w-64 sm:w-fit">{{ post.title }}</span>
              <span>{{ post.date.string.slice(0, 7) }}</span>
            </a>
          </li>
        </ul>
      </template>
    </template>
  </div>
</template>
