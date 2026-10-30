import { computed } from 'vue'
import { useData } from 'vitepress'
import { usePosts } from '@vuemo/core/client'
import { readFlavor, readPalette } from './types'
import { flavored, plain } from './flavor'

export * from './format'

/** The palette, as plain config data: the same during SSR and on the client. */
export function usePalette() {
  const { theme } = useData()
  return computed(() => readPalette(theme.value, () => {}))
}

/** The labels of the trigger palette (`themeConfig.flavor`). */
export function useTerms() {
  const { theme } = useData()
  return computed(() => (readFlavor(theme.value, () => {}) ? flavored : plain))
}

/** A post's number: the oldest post is 1. Stable while posts are only added. */
export function useLogNumbers() {
  const posts = usePosts()
  return computed(() => new Map(posts.map((p, i) => [p.url, posts.length - i])))
}
