<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { readAbout } from '../types'
import Title from './Title.vue'

const { theme, frontmatter } = useData()
const about = computed(() => readAbout(theme.value, () => {}))
const quote = computed(() => about.value.quote ?? 'Trigger your blog !')
// a full URL stays as it is; a file in public/ gets the site base
const avatar = computed(() => {
  const src = about.value.avatar
  return src && !/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(src) ? withBase(src) : src
})
</script>

<template>
  <div class="theme-container">
    <Title :text="frontmatter.title || 'About'" />
    <figure class="bg-slate-200 rounded-xl p-8 dark:bg-slate-700">
      <img v-if="avatar" class="w-24 h-24 rounded-full mx-auto" :src="avatar" alt="avatar" />
      <div class="pt-6 space-y-4 flex justify-center">
        <p class="text-lg font-medium text-gray-500 dark:text-cyan-200">“{{ quote }}”</p>
      </div>
    </figure>
  </div>
</template>
