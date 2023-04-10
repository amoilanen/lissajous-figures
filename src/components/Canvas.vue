<script setup lang="ts">
import { InitialConditions } from '@/models/InitialConditions';

const props = defineProps({
  initialConditions: {
    type: InitialConditions,
    required: true
  }
});
</script>

<template>
  <div class="canvas">
    <span class="text-h6">Under construction...</span>
    <span>{{initialConditions}}</span>
  </div>
</template>

<style scoped>
</style>
