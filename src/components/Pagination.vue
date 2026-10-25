<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ page: number; totalPages: number }>()
const emit = defineEmits<{ go: [page: number] }>()

const barLength = 5
// up to five page numbers around the current page
const pages = computed(() => {
  const count = Math.min(barLength, props.totalPages)
  const start = Math.max(1, Math.min(props.page - Math.floor(count / 2), props.totalPages - count + 1))
  return Array.from({ length: count }, (_, i) => start + i)
})
const go = (n: number) => {
  if (n >= 1 && n <= props.totalPages && n !== props.page) emit('go', n)
}
</script>

<template>
  <nav v-if="totalPages > 1" class="flex justify-center pt-6" aria-label="page navigation">
    <ul class="flex">
      <li>
        <button type="button" class="theme-pagination rounded-l-lg" :disabled="page <= 1" @click="go(page - 1)">
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clip-rule="evenodd" />
          </svg>
        </button>
      </li>
      <li v-for="n in pages" :key="n">
        <button
          type="button"
          :class="n === page ? 'theme-pagination-clicked theme-pagination' : 'theme-pagination'"
          :aria-current="n === page ? 'page' : undefined"
          @click="go(n)"
        >
          {{ n }}
        </button>
      </li>
      <li>
        <button type="button" class="theme-pagination rounded-r-lg" :disabled="page >= totalPages" @click="go(page + 1)">
          <span class="sr-only">Next</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clip-rule="evenodd" />
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>
