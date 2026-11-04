<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { watchEffect } from 'vue'
import { readAbout, readFlavor, readStyle } from './types'
import { useStyle } from './composables'
import Home from './layouts/Home.vue'

// warn once per session, not for every page (or every SSR render)
let warned = false
function warnOnce(message: string) {
  if (warned) return
  warned = true
  console.warn(message)
}

const { Layout } = DefaultTheme
const { theme } = useData()
// warns about wrong theme options (also during `vitepress build`)
watchEffect(() => {
  readAbout(theme.value, warnOnce)
  readStyle(theme.value, warnOnce)
  readFlavor(theme.value, warnOnce)
})
// the style is plain data in the config, so the attribute is the same in SSR and on the client
const themeStyle = useStyle()
</script>

<template>
  <div class="tr-root" :data-style="themeStyle">
    <Layout>
      <template #home-hero-after>
        <Home />
      </template>
    </Layout>
  </div>
</template>
