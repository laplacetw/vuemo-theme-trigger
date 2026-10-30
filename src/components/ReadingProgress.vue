<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// A 2px line at the top of the page: how far the post has been read. Set on every scroll event, nothing eases it.
const width = ref(0)
function update() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  width.value = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0
}
onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>

<template>
  <div class="tr-progress" aria-hidden="true"><div :style="{ width: `${width}%` }"></div></div>
</template>
