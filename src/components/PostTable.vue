<script setup lang="ts">
import { withBase } from 'vitepress'
import { useTaxonomyLinks, type Post } from '@vuemo/core/client'
import { dotDate, pad, useLogNumbers, useTerms } from '../composables'

// The trigger palette's post table (archive, tags, categories): date, number, title, category
defineProps<{ posts: Post[] }>()
const numbers = useLogNumbers()
const terms = useTerms()
const { categoryLink } = useTaxonomyLinks()
</script>

<template>
  <table class="tr-table">
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
</template>
