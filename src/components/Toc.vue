<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { useTerms } from '../composables'

// Table of contents of the post body (h2 and h3). On wide screens it stays beside the post and marks the
// current section; on narrow ones it is a collapsed list above the post.
const props = defineProps<{ variant: 'aside' | 'inline' }>()
const terms = useTerms()
const route = useRoute()
const headings = ref<{ id: string; text: string; level: number }[]>([])
const active = ref('')

function text(h: Element) {
  // the heading text without VitePress's anchor link
  return [...h.childNodes]
    .filter((n) => !(n instanceof Element && n.classList.contains('header-anchor')))
    .map((n) => n.textContent ?? '')
    .join('')
    .trim()
}

function collect() {
  headings.value = [...document.querySelectorAll('.vuemo-content h2[id], .vuemo-content h3[id]')].map((h) => ({
    id: h.id,
    text: text(h),
    level: h.tagName === 'H2' ? 2 : 3
  }))
  spy()
}

function spy() {
  if (props.variant !== 'aside') return
  const offset = 96
  let current = ''
  for (const { id } of headings.value) {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= offset) current = id
  }
  active.value = current
}

onMounted(() => {
  collect()
  if (props.variant === 'aside') window.addEventListener('scroll', spy, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', spy))
watch(() => route.path, () => nextTick(collect))
</script>

<template>
  <nav v-if="headings.length && variant === 'aside'" class="tr-toc" :aria-label="terms.contents">
    <p class="tr-label">{{ terms.contents }}</p>
    <ul>
      <li v-for="h in headings" :key="h.id" :class="{ 'tr-toc-sub': h.level === 3 }">
        <a :href="`#${h.id}`" :aria-current="active === h.id ? 'location' : undefined">{{ h.text }}</a>
      </li>
    </ul>
  </nav>
  <details v-else-if="headings.length" class="tr-toc tr-toc-inline">
    <summary class="tr-label">{{ terms.contents }}</summary>
    <ul>
      <li v-for="h in headings" :key="h.id" :class="{ 'tr-toc-sub': h.level === 3 }">
        <a :href="`#${h.id}`">{{ h.text }}</a>
      </li>
    </ul>
  </details>
</template>
