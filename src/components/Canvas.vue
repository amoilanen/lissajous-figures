<script setup lang="ts">
defineProps<{
  msg: string;
}>();
</script>

<template>
  <div class="canvas">
    <span class="text-h6">{{ msg }}</span>
  </div>
</template>

<style scoped>
</style>
