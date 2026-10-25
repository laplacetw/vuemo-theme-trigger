<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import type { VuemoThemeConfig } from '@vuemo/core'
import { usePagination } from '@vuemo/core/client'
import type { Post } from '@vuemo/core/client'
import PostInfo from '../components/PostInfo.vue'
import Pagination from '../components/Pagination.vue'

const { theme } = useData<VuemoThemeConfig>()
const { page, goPage } = usePagination(theme.value.postsPerPage ?? 5)

/** `summary: 'excerpt'` shows the excerpt, else the description; `'description'` shows the description only. */
function summary(post: Post): { html?: string; text?: string } {
  if (theme.value.summary !== 'description' && post.excerpt?.trim()) return { html: post.excerpt }
  if (post.description?.trim()) return { text: post.description }
  return {}
}
</script>

<template>
  <div class="theme-container">
    <ul class="divide-y divide-gray-600">
      <li v-for="post in page.items" :key="post.url" class="mb-6 p-6">
        <article class="space-y-2 xl:space-y-0 xl:items-baseline">
          <PostInfo :date="post.date.string" :category="post.category" />
          <h2 class="pb-2 text-2xl leading-8 font-bold tracking-tight">
            <a class="text-gray-900 dark:text-white" :href="withBase(post.url)">{{ post.title }}</a>
          </h2>
          <template v-for="s in [summary(post)]" :key="post.url">
            <div v-if="s.html" class="theme-excerpt" v-html="s.html"></div>
            <div v-else-if="s.text" class="theme-excerpt">
              <p>{{ s.text }}</p>
            </div>
          </template>
          <div class="grid text-base leading-6 font-medium">
            <a class="theme-readmore" :href="withBase(post.url)">Read more<span class="sr-only">: {{ post.title }}</span></a>
          </div>
        </article>
      </li>
    </ul>
    <Pagination :page="page.page" :total-pages="page.totalPages" @go="goPage" />
  </div>
</template>
