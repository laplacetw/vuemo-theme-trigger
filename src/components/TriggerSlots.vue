<script setup lang="ts">
import { computed } from 'vue'
import { useTaxonomyLinks } from '@vuemo/core/client'

// Tags as a loadout: at most four fixed-width slots, the empty ones drawn as empty frames
const props = defineProps<{ tags: string[] }>()
const SLOTS = 4
const { tagLink } = useTaxonomyLinks()
const shown = computed(() => props.tags.slice(0, SLOTS))
const empty = computed(() => SLOTS - shown.value.length)
</script>

<template>
  <ul v-if="tags.length" class="tr-slots" aria-label="Tags">
    <li v-for="tag in shown" :key="tag">
      <a class="tr-slot" :href="tagLink(tag)" :title="tag">{{ tag }}</a>
    </li>
    <li v-for="n in empty" :key="`empty-${n}`" aria-hidden="true">
      <span class="tr-slot tr-slot-empty"></span>
    </li>
  </ul>
</template>
