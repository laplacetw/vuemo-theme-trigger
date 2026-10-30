<script setup lang="ts">
import { usePalette } from '../composables'
import Default from './default/Tag.vue'
import Trigger from './trigger/Tag.vue'

const palette = usePalette()
</script>

<template>
  <component :is="palette === 'trigger' ? Trigger : Default" />
</template>
