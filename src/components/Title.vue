<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <h1 class="pb-6 text-4xl font-extrabold">
    <span class="theme-title">{{ text }}</span>
  </h1>
</template>
