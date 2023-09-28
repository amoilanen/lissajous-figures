<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useSimulationStore } from '@/stores/simulation'
import { numberValidation } from '@/utils/Validations'

const simulationStore = useSimulationStore()

const state = reactive({
  areInputsValid: true
})

const validationRules = {
  frequency: [ numberValidation ],
  phase: [ numberValidation ]
}

const { conditionsInput, isDrawing, timeSpeed } = storeToRefs(simulationStore)
const { timeSpeedMax, draw } = simulationStore

const controlsForm = ref<HTMLFormElement | null>(null)

onMounted(async () => {
  await controlsForm.value!.validate()
  if (state.areInputsValid) {
    draw()
  }
})

function stopDrawing() {
  //TODO: Implement
  console.log("Stopping drawing...")
}
</script>

<template>
  <v-form ref="controlsForm" v-model="state.areInputsValid">
    <v-container class="controls">
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="conditionsInput.x.phase" :rules="validationRules.phase" label="x initial phase"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="conditionsInput.x.frequency" :rules="validationRules.frequency" label="x frequency"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="conditionsInput.y.phase" :rules="validationRules.phase" label="y initial phase"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="conditionsInput.y.frequency" :rules="validationRules.frequency" label="y frequency"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-btn @click="draw" :disabled="!state.areInputsValid">Draw</v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn @click="stopDrawing" :disabled="!isDrawing">Stop</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
        </v-col>
        <v-col cols="6">
          <v-label
            class="text-caption"
            text="Time speed:" />
          <v-slider
            v-model="timeSpeed"
            :min="0"
            :max="timeSpeedMax">
            <template v-slot:prepend>
              <v-label
                text="min"
              ></v-label>
            </template>
            <template v-slot:append>
              <v-label
                text="max"
              ></v-label>
            </template>
          ></v-slider>
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
