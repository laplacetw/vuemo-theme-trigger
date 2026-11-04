<script setup lang="ts">
// Decoration of the "anime" style: a small solid cube turned 45 degrees (corner to the front), drawn here.
// It carries no information (aria-hidden) and the `'normal'` style hides it with CSS.
</script>

<template>
  <svg class="tr-tag" viewBox="0 0 20 22" aria-hidden="true">
    <polygon class="tr-tag-top" points="10,1 19,6 10,11 1,6" />
    <polygon class="tr-tag-left" points="1,6 10,11 10,21 1,16" />
    <polygon class="tr-tag-right" points="19,6 10,11 10,21 19,16" />
  </svg>
</template>
