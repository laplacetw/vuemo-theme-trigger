<script setup lang="ts">
import { useTaxonomyLinks } from '@vuemo/core/client'

defineProps<{ date: string; category?: string }>()
const { categoryLink } = useTaxonomyLinks()
</script>

<template>
  <p class="pb-2 text-base leading-6 font-medium text-gray-500 dark:text-gray-300">
    <span class="theme-date">📆{{ date }}</span>
    <template v-if="category">
      | 📂<a class="hover:underline" :href="categoryLink(category)">{{ category }}</a>
    </template>
  </p>
</template>
