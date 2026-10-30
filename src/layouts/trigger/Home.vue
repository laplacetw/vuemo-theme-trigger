<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import type { VuemoThemeConfig } from '@vuemo/core'
import { useCategories, usePagination, useTaxonomyLinks } from '@vuemo/core/client'
import type { Post } from '@vuemo/core/client'
import { computed } from 'vue'
import LogMeta from '../../components/LogMeta.vue'
import Pagination from '../../components/Pagination.vue'
import AuthorCard from '../../components/AuthorCard.vue'
import { categoryCodes, useTerms } from '../../composables'

const { site, theme } = useData<VuemoThemeConfig>()
const { page, goPage } = usePagination(theme.value.postsPerPage ?? 5)
const categories = useCategories()
const { categoryLink } = useTaxonomyLinks()
const terms = useTerms()
const codes = computed(() => categoryCodes(Object.keys(categories)))
// in code order (by name), so A01 comes first
const sorted = computed(() => [...codes.value.keys()].map((name) => [name, categories[name]] as const))

/** One line: the description, else the excerpt as text (`summary: 'description'` never uses the excerpt). */
function summary(post: Post): string {
  if (post.description?.trim()) return post.description
  if (theme.value.summary === 'description' || !post.excerpt) return ''
  return post.excerpt.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}
</script>

<template>
  <div class="tr-home">
    <header class="tr-home-head">
      <h1>{{ site.title }}</h1>
      <p v-if="site.description">{{ site.description }}</p>
    </header>
    <div class="tr-home-main">
      <ol class="tr-list">
        <li v-for="post in page.items" :key="post.url">
          <article>
            <LogMeta :post="post" />
            <h2><a :href="withBase(post.url)">{{ post.title }}</a></h2>
            <p v-if="summary(post)" class="tr-summary">{{ summary(post) }}</p>
          </article>
        </li>
      </ol>
      <Pagination :page="page.page" :total-pages="page.totalPages" @go="goPage" />
    </div>
    <aside class="tr-home-side">
      <AuthorCard />
      <nav v-if="codes.size" class="tr-squads" aria-labelledby="tr-squads-label">
        <p id="tr-squads-label" class="tr-label">Category</p>
        <ul>
          <li v-for="[cat, list] in sorted" :key="cat">
            <a :href="categoryLink(String(cat))">
              <span v-if="terms.squad" class="tr-code">{{ terms.squad }}{{ codes.get(String(cat)) }}</span>
              <span class="tr-squad-name">{{ cat }}</span>
              <span class="tr-count">{{ list.length }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>
