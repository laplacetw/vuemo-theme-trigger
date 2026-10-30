<script setup lang="ts">
import { useData } from 'vitepress'
import AuthorCard from '../../components/AuthorCard.vue'

const { frontmatter } = useData()
</script>

<template>
  <div class="tr-page">
    <header class="tr-page-head">
      <h1>{{ frontmatter.title || 'About' }}</h1>
    </header>
    <AuthorCard />
    <Content class="vp-doc tr-about-body" />
  </div>
</template>
