<script setup lang="ts">
import { usePalette } from '../composables'
import Default from './default/Category.vue'
import Trigger from './trigger/Category.vue'

const palette = usePalette()
</script>

<template>
  <component :is="palette === 'trigger' ? Trigger : Default" />
</template>
