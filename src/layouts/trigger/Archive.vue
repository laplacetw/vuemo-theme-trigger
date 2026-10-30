<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { usePosts, useTaxonomyLinks } from '@vuemo/core/client'
import { dotDate, pad, useLogNumbers, useTerms } from '../../composables'

const { frontmatter } = useData()
const posts = usePosts()
const numbers = useLogNumbers()
const terms = useTerms()
const { categoryLink } = useTaxonomyLinks()
const total = computed(() => posts.length)
</script>

<template>
  <div class="tr-page">
    <header class="tr-page-head">
      <h1>{{ frontmatter.title || 'Archives' }}</h1>
      <p class="tr-meta">{{ total }} {{ total === 1 ? 'post' : 'posts' }}</p>
    </header>
    <table class="tr-table tr-mark">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col" class="tr-col-wide">No.</th>
          <th scope="col">Title</th>
          <th scope="col" class="tr-col-wide">Category</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.url">
          <td class="tr-mono"><time :datetime="post.date.string">{{ dotDate(post.date.string) }}</time></td>
          <td class="tr-mono tr-col-wide">{{ terms.log }}{{ pad(numbers.get(post.url) ?? 0, 4) }}</td>
          <td><a :href="withBase(post.url)">{{ post.title }}</a></td>
          <td class="tr-col-wide">
            <a v-if="post.category" :href="categoryLink(post.category)">{{ post.category }}</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
