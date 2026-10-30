<script setup lang="ts">
import { usePalette } from '../composables'
import Default from './default/Archive.vue'
import Trigger from './trigger/Archive.vue'

const palette = usePalette()
</script>

<template>
  <component :is="palette === 'trigger' ? Trigger : Default" />
</template>
