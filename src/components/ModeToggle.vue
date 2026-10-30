<script setup lang="ts">
import { useData } from 'vitepress'
import { useTerms } from '../composables'

// The dark mode switch of the trigger palette: a text button. Both words are rendered and CSS marks the
// current one from `html.dark`, so the server HTML and hydration agree.
const { isDark } = useData()
const terms = useTerms()
</script>

<template>
  <button type="button" class="tr-mode" aria-label="Toggle dark mode" @click="isDark = !isDark">
    <span class="tr-mode-day">{{ terms.day }}</span> / <span class="tr-mode-night">{{ terms.night }}</span>
  </button>
</template>
