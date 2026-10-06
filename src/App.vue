<script setup lang="ts">
/**
 * @file App.vue
 * @description Root application component with global minimalist navbar and view outlet.
 */
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/shared/AppNavbar.vue'
</script>

<template>
  <div class="app-root">
    <AppNavbar />
    <RouterView />
  </div>
</template>

<style>
body {
  font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8faf9;
  color: #1a1a1a;
  margin: 0;
  padding: 0;
}
</style>
