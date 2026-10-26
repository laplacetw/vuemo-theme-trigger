<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { useCategories, useQueryParam } from '@vuemo/core/client'
import Title from '../components/Title.vue'

const { frontmatter } = useData()
const categories = useCategories()
// the selected category lives in the URL (?category=...), so category links on posts preselect it
const selected = useQueryParam('category')
</script>

<template>
  <div class="theme-container">
    <Title :text="frontmatter.title || 'Category'" />
    <div class="flex flex-wrap">
      <a
        v-for="(list, cat) in categories"
        :key="cat"
        class="px-2 my-1"
        :href="`?category=${encodeURIComponent(String(cat))}`"
        @click.prevent="selected = String(cat)"
      >
        <span class="theme-badge">{{ cat }}</span>
        <sup>{{ list.length }}</sup>
      </a>
    </div>
    <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-500" />
    <template v-if="selected && Object.hasOwn(categories, selected)">
      <h2 id="catName" class="pb-2">📁 {{ selected }}</h2>
      <ul>
        <li v-for="post in categories[selected]" :key="post.url">
          <a class="decoration-2 decoration-cyan-600 dark:decoration-cyan-300 hover:underline flex justify-between my-3 text-base leading-6 font-medium text-gray-500 dark:text-gray-300" :href="withBase(post.url)">
            <span class="truncate w-64 sm:w-fit">{{ post.title }}</span>
            <span>{{ post.date.string.slice(0, 7) }}</span>
          </a>
        </li>
      </ul>
    </template>
  </div>
</template>
