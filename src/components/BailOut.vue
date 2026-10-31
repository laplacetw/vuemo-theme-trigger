<script setup lang="ts">
import { useTerms } from '../composables'

// Back to top: a hexagon button (an outline drawn here, see ASSETS.md) that jumps straight to the top;
// keyboard focus moves to the site title in the nav (not to VitePress's skip link, which shows itself when focused)
const terms = useTerms()
function top() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  document.querySelector<HTMLElement>('.VPNavBarTitle a')?.focus({ preventScroll: true })
}
</script>

<template>
  <button type="button" class="tr-bailout" :aria-label="terms.bailOutLabel" @click="top">
    <svg class="tr-bailout-hex" viewBox="0 0 72 64" aria-hidden="true">
      <polygon points="18,1 54,1 71,32 54,63 18,63 1,32" />
    </svg>
    <span class="tr-bailout-text" aria-hidden="true">
      <span v-for="line in terms.bailOut" :key="line">{{ line }}</span>
    </span>
  </button>
</template>
