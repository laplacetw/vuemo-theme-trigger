<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { useCategories, useQueryParam } from '@vuemo/core/client'
import { categoryCodes, dotDate, useTerms } from '../../composables'

const { frontmatter } = useData()
const categories = useCategories()
const terms = useTerms()
const codes = computed(() => categoryCodes(Object.keys(categories)))
// in code order (by name), so A01 comes first
const sorted = computed(() => [...codes.value.keys()].map((name) => [name, categories[name]] as const))
// the selected category lives in the URL (?category=...), so category links on posts preselect it
const selected = useQueryParam('category')
</script>

<template>
  <div class="tr-page">
    <header class="tr-page-head">
      <h1>{{ frontmatter.title || 'Category' }}</h1>
    </header>
    <ul class="tr-rows">
      <li v-for="[cat, list] in sorted" :key="cat">
        <a
          :href="`?category=${encodeURIComponent(String(cat))}`"
          :aria-current="selected === String(cat) ? 'true' : undefined"
          @click.prevent="selected = String(cat)"
        >
          <span v-if="terms.squad" class="tr-code">{{ terms.squad }}{{ codes.get(String(cat)) }}</span>
          <span class="tr-squad-name">{{ cat }}</span>
          <span class="tr-count">{{ list.length }}</span>
        </a>
      </li>
    </ul>
    <section v-if="selected && Object.hasOwn(categories, selected)" class="tr-selection">
      <h2 class="tr-label">
        {{ terms.members }} · <span v-if="terms.squad">{{ terms.squad }}{{ codes.get(selected) }} </span>{{ selected }}
      </h2>
      <ul class="tr-rows">
        <li v-for="post in categories[selected]" :key="post.url">
          <a :href="withBase(post.url)">
            <span class="tr-code">{{ dotDate(post.date.string) }}</span>
            <span class="tr-squad-name">{{ post.title }}</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
