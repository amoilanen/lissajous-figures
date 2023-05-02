<script setup lang="ts">
import { InitialConditions } from '@/models/InitialConditions';

const props = defineProps({
  initialConditions: {
    type: InitialConditions,
    required: true
  }
});

const emit = defineEmits<{
  (e: 'change', conditions: InitialConditions): void
}>()
</script>

<script lang="ts">

export default {
  data() {
    return {
      conditions: this.$props.initialConditions.clone()
    }
  },
  methods: {
    updateConditions() {
      this.$emit("change", this.conditions.clone());
    }
  }
}
</script>

<template>
  <v-container class="controls">
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="conditions.x.phase" label="Phase X"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="conditions.x.frequency" label="Frequency X"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="conditions.y.phase" label="Phase Y"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="conditions.y.frequency" label="Frequency Y"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn @click="updateConditions">Draw</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>
