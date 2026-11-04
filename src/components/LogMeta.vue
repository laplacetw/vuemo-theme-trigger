<script setup lang="ts">
import { computed } from 'vue'
import { useTaxonomyLinks, type Post } from '@vuemo/core/client'
import { dotDate, pad, readingMinutes, useLogNumbers, useTerms } from '../composables'
import SignalTag from './SignalTag.vue'

// The anime style's line above a post title: `LOG-0042 · 2026.10.30 · 6 MIN · Category`
const props = defineProps<{ post: Post }>()
const terms = useTerms()
const numbers = useLogNumbers()
const { categoryLink } = useTaxonomyLinks()
const number = computed(() => numbers.value.get(props.post.url))
const minutes = computed(() => readingMinutes(props.post))
</script>

<template>
  <p class="tr-meta">
    <SignalTag />
    <span v-if="number" class="tr-meta-item">{{ terms.log }}{{ pad(number, 4) }}</span>
    <span class="tr-meta-item"><time :datetime="post.date.string">{{ dotDate(post.date.string) }}</time></span>
    <span v-if="minutes" class="tr-meta-item">{{ minutes }} MIN</span>
    <span v-if="post.category" class="tr-meta-item"><a :href="categoryLink(post.category)">{{ post.category }}</a></span>
  </p>
</template>
