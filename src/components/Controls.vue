<script setup lang="ts">
import { InitialConditions, FrequencyAndPhase } from '@/models/InitialConditions';

const emit = defineEmits<{
  (e: 'change', conditions: InitialConditions): void
}>()
</script>

<script lang="ts">

const initialConditions = new InitialConditions(
  new FrequencyAndPhase(0, 10),
  new FrequencyAndPhase(0, 10)
)

export default {
  data() {
    return InitialConditions
  }
}
</script>

<template>
  <v-container class="controls">
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="initialConditions.x.phase" label="Phase X"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="initialConditions.x.frequency" label="Frequency X"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="initialConditions.y.phase" label="Phase Y"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="initialConditions.y.frequency" label="Frequency Y"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn>Draw</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>
