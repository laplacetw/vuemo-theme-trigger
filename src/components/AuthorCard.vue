<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { usePosts } from '@vuemo/core/client'
import { readAbout } from '../types'
import { useTerms, wordsOf } from '../composables'

// The author as a small data sheet: avatar, quote, and three numbers (posts, words, years of writing)
const { theme } = useData()
const terms = useTerms()
const posts = usePosts()
const about = computed(() => readAbout(theme.value, () => {}))
const avatar = computed(() => {
  const src = about.value.avatar
  return src && !/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(src) ? withBase(src) : src
})
const words = computed(() => {
  if (!posts.length || wordsOf(posts[0]) === undefined) return undefined
  return posts.reduce((n, p) => n + (wordsOf(p) ?? 0), 0)
})
// from the year of the first post to the year of the latest one (not today: the build would change every year)
const years = computed(() => (posts.length ? +posts[0].date.string.slice(0, 4) - +posts[posts.length - 1].date.string.slice(0, 4) + 1 : 0))
const format = (n: number) => n.toLocaleString('en-US')
</script>

<template>
  <section class="tr-card tr-mark">
    <img v-if="avatar" class="tr-card-avatar" :src="avatar" alt="avatar" width="64" height="64" />
    <p class="tr-card-quote">{{ about.quote ?? 'Trigger your blog !' }}</p>
    <dl class="tr-stats">
      <div>
        <dt>{{ terms.stats.posts }}</dt>
        <dd>{{ format(posts.length) }}</dd>
      </div>
      <div v-if="words !== undefined">
        <dt>{{ terms.stats.words }}</dt>
        <dd>{{ format(words) }}</dd>
      </div>
      <div>
        <dt>{{ terms.stats.years }}</dt>
        <dd>{{ years }}</dd>
      </div>
    </dl>
  </section>
</template>
