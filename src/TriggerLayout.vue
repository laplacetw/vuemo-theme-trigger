<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { watchEffect } from 'vue'
import { readAbout } from './types'
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
watchEffect(() => readAbout(theme.value, warnOnce))
</script>

<template>
  <Layout>
    <template #home-hero-after>
      <Home />
    </template>
  </Layout>
</template>
