<script setup lang="ts">
import { usePalette } from '../composables'
import Default from './default/About.vue'
import Trigger from './trigger/About.vue'

const palette = usePalette()
</script>

<template>
  <component :is="palette === 'trigger' ? Trigger : Default" />
</template>
