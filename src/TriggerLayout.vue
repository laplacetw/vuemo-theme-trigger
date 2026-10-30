<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { computed, watchEffect } from 'vue'
import { readAbout, readFlavor, readPalette } from './types'
import { usePalette, useTerms } from './composables'
import Home from './layouts/Home.vue'
import ModeToggle from './components/ModeToggle.vue'
import Gate from './components/Gate.vue'

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
  readPalette(theme.value, warnOnce)
  readFlavor(theme.value, warnOnce)
})
// the palette is plain data in the config, so the attribute is the same in SSR and on the client
const palette = usePalette()
const terms = useTerms()
// the code block label comes from the terms (src/flavor.ts), handed to CSS as a string
const style = computed(() => (palette.value === 'trigger' ? { '--tr-code-prefix': JSON.stringify(terms.value.codeLang) } : undefined))
</script>

<template>
  <div class="tr-root" :data-palette="palette" :style="style">
    <Layout>
      <template #home-hero-after>
        <Home />
      </template>
      <template v-if="palette === 'trigger'" #nav-bar-content-after>
        <ModeToggle />
      </template>
      <template v-if="palette === 'trigger'" #not-found>
        <Gate />
      </template>
    </Layout>
  </div>
</template>
