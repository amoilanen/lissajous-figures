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
      areInputsValid: true,
      conditions: this.$props.initialConditions.clone(),
      rules: {
        frequency: [
          (value: string) => {
            if (/[\d\.]+/.test(value))
              return true
            else
             return "Frequency should be a number"
          }
        ],
        phase: [
          (value: string) => {
            if (/[\d\.]+/.test(value))
              return true
            else
             return "Phase should be a number"
          }
        ]
      }
    }
  },
  methods: {
    updateConditions() {
      this.$emit("change", this.conditions.clone());
    }
  },
  mounted() {
    this.$refs.controlsForm.validate();
  }
}
</script>

<template>
  <v-form ref="controlsForm" v-model="areInputsValid">
    <v-container class="controls">
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="conditions.x.phase" :rules="rules.phase" label="x initial phase"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="conditions.x.frequency" :rules="rules.frequency" label="x frequency"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="conditions.y.phase" :rules="rules.phase" label="y initial phase"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="conditions.y.frequency" :rules="rules.frequency" label="y frequency"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn @click="updateConditions" :disabled="!areInputsValid">Draw</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped>
  .v-form {
    width: 100%;
  }
</style>
