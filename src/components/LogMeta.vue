<script setup lang="ts">
import { computed } from 'vue'
import { useTaxonomyLinks, type Post } from '@vuemo/core/client'
import { dotDate, pad, readingMinutes, useLogNumbers, useTerms } from '../composables'

// One monospace line above a post title: `LOG-0042 · 2026.10.30 · 6 MIN · Category`
const props = defineProps<{ post: Post; category?: boolean }>()
const terms = useTerms()
const numbers = useLogNumbers()
const { categoryLink } = useTaxonomyLinks()
const number = computed(() => numbers.value.get(props.post.url))
const minutes = computed(() => readingMinutes(props.post))
</script>

<template>
  <p class="tr-meta">
    <span v-if="number">{{ terms.log }}{{ pad(number, 4) }}</span>
    <span><time :datetime="post.date.string">{{ dotDate(post.date.string) }}</time></span>
    <span v-if="minutes">{{ minutes }} MIN</span>
    <span v-if="category && post.category"><a :href="categoryLink(post.category)">{{ post.category }}</a></span>
  </p>
</template>
