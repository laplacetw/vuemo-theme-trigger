<script setup lang="ts">
import { withBase } from 'vitepress'
import { useTerms } from '../composables'

// 404 of the trigger palette: a plain black circle (original, drawn here) and one line of text
const terms = useTerms()
</script>

<template>
  <div class="tr-gate">
    <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
      <circle cx="48" cy="48" r="47" fill="#000" stroke="var(--tr-line)" stroke-width="1" />
    </svg>
    <h1 class="tr-meta">{{ terms.notFound }}</h1>
    <a :href="withBase('/')">Home</a>
  </div>
</template>
