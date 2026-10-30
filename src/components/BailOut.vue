<script setup lang="ts">
import { useTerms } from '../composables'

const terms = useTerms()
// jumps straight to the top; focus goes back to the top of the page for keyboard users
function top() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  document.querySelector<HTMLElement>('.VPSkipLink, #app a[href]')?.focus({ preventScroll: true })
}
</script>

<template>
  <button type="button" class="tr-bailout" @click="top">{{ terms.bailOut }}</button>
</template>
