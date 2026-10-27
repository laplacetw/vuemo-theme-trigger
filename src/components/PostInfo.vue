<script setup lang="ts">
import { useTaxonomyLinks } from '@vuemo/core/client'
import TriggerChip from './TriggerChip.vue'

defineProps<{ date: string; category?: string }>()
const { categoryLink } = useTaxonomyLinks()
</script>

<template>
  <p class="pb-2 text-base leading-6 font-medium text-(color:--tr-text-muted)">
    <TriggerChip /><span class="theme-date">📆{{ date }}</span>
    <template v-if="category">
      | 📂<a class="hover:underline" :href="categoryLink(category)">{{ category }}</a>
    </template>
  </p>
</template>
