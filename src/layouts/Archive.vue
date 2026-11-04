<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { useArchives, usePosts } from '@vuemo/core/client'
import Title from '../components/Title.vue'
import PostTable from '../components/PostTable.vue'
import { useStyle } from '../composables'

const { frontmatter } = useData()
const archives = useArchives()
// the anime style shows one table: date, number, title, category
const themeStyle = useStyle()
const posts = usePosts()
const total = computed(() => archives.reduce((n, group) => n + group.posts.length, 0))
</script>

<template>
  <div class="theme-container">
    <Title :text="frontmatter.title || 'Archives'" />
    <p class="pb-2 text-xl font-extrabold">Total : {{ total }} {{ total === 1 ? 'post' : 'posts' }}</p>
    <hr class="h-px my-4 bg-(--tr-rule) border-0" />
    <PostTable v-if="themeStyle === 'anime'" :posts="posts" />
    <template v-else>
      <section v-for="(group, i) in archives" :key="group.year">
        <h2 class="pb-2 text-xl font-extrabold">{{ group.year }}</h2>
        <ul>
          <li v-for="post in group.posts" :key="post.url">
            <a class="decoration-2 decoration-(color:--tr-accent) hover:underline flex justify-between my-3 text-base leading-6 font-medium text-(color:--tr-text-muted)" :href="withBase(post.url)">
              <span class="truncate w-64 sm:w-fit">{{ post.title }}</span>
              <span>{{ post.date.string.slice(5, 10) }}</span>
            </a>
          </li>
        </ul>
        <hr v-if="i < archives.length - 1" class="h-px my-4 bg-(--tr-rule) border-0" />
      </section>
    </template>
  </div>
</template>
