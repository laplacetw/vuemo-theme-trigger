<script setup lang="ts">
import { usePalette } from '../composables'
import Default from './default/Post.vue'
import Trigger from './trigger/Post.vue'

const palette = usePalette()
</script>

<template>
  <component :is="palette === 'trigger' ? Trigger : Default">
    <template #post-before-content><slot name="post-before-content" /></template>
    <template #post-after-content><slot name="post-after-content" /></template>
    <template #post-comments><slot name="post-comments" /></template>
  </component>
</template>
