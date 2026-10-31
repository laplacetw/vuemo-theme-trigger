<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { useArchives, usePosts, useTaxonomyLinks } from '@vuemo/core/client'
import Title from '../components/Title.vue'
import { dotDate, pad, useLogNumbers, usePalette, useTerms } from '../composables'

const { frontmatter } = useData()
const archives = useArchives()
// the trigger palette shows one table: date, number, title, category
const palette = usePalette()
const posts = usePosts()
const numbers = useLogNumbers()
const terms = useTerms()
const { categoryLink } = useTaxonomyLinks()
const total = computed(() => archives.reduce((n, group) => n + group.posts.length, 0))
</script>

<template>
  <div class="theme-container">
    <Title :text="frontmatter.title || 'Archives'" />
    <p class="pb-2 text-xl font-extrabold">Total : {{ total }} {{ total === 1 ? 'post' : 'posts' }}</p>
    <hr class="h-px my-4 bg-(--tr-rule) border-0" />
    <table v-if="palette === 'trigger'" class="tr-table">
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
