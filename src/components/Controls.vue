<script setup lang="ts">
import { reactive, ref, onMounted, computed} from 'vue'
import { storeToRefs } from 'pinia'
import { useSimulationStore, DrawingState } from '@/stores/simulation'
import { numberValidation } from '@/utils/Validations'
import PredefinedConditions from '@/components/PredefinedConditions.vue'

import type { InitialConditionsInput } from '@/models/InitialConditions'

const simulationStore = useSimulationStore()

const state = reactive({
  areInputsValid: true
})

const validationRules = {
  frequency: [ numberValidation ],
  phase: [ numberValidation ]
}

const { conditionsInput, timeSpeed, drawingState } = storeToRefs(simulationStore)
const { timeSpeedMax, startDrawing, pauseDrawing, resumeDrawing } = simulationStore

const controlsForm = ref<HTMLFormElement | null>(null)

function pauseOrResumeDrawing() {
  if (drawingState.value == DrawingState.Started || drawingState.value == DrawingState.Resumed) {
    pauseDrawing()
  } else if (drawingState.value == DrawingState.Paused) {
    resumeDrawing()
  }
}

const pauseOrResumeButtonLabel = computed(() => {
  if (drawingState.value == DrawingState.Paused) {
    return 'Resume'
  } else {
    return 'Pause'
  }
})

const isStopOrResumeButtonEnabled = computed(() => {
  return [DrawingState.Started, DrawingState.Resumed, DrawingState.Paused].includes(drawingState.value)
})

onMounted(async () => {
  await controlsForm.value!.validate()
  if (state.areInputsValid) {
    await startDrawing()
  }
})

async function onPredefinedConditionsSelected(selectedConditionsInput: InitialConditionsInput) {
  conditionsInput.value = selectedConditionsInput;
  await startDrawing()
}

defineExpose({
  state, // for testing
  controlsForm // for testing
})
</script>

<template>
  <v-form ref="controlsForm" v-model="state.areInputsValid">
    <v-container class="controls">
      <v-row>
        <PredefinedConditions @conditionsSelected="onPredefinedConditionsSelected" />
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field data-test="phaseX" v-model="conditionsInput.x.phase" :rules="validationRules.phase" label="x initial phase"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field data-test="frequencyX" v-model="conditionsInput.x.frequency" :rules="validationRules.frequency" label="x frequency"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field data-test="phaseY" v-model="conditionsInput.y.phase" :rules="validationRules.phase" label="y initial phase"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field data-test="frequencyY" v-model="conditionsInput.y.frequency" :rules="validationRules.frequency" label="y frequency"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-btn data-test="draw" @click="startDrawing" :disabled="!state.areInputsValid">Draw</v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn data-test="pauseOrResume" @click="pauseOrResumeDrawing" :disabled="!isStopOrResumeButtonEnabled">{{pauseOrResumeButtonLabel}}</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="6">
          <v-slider
            class="pa-0 ma-0"
            v-model="timeSpeed"
            :hide-details="true"
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
          <v-label
            class="mt-0 pt-0 text-caption"
            text="Time speed" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style>
  .v-form {
    width: 100%;
  }

  #inputs-legend > .MathJax_Display {
    margin: 0;
    padding: 0;
    margin-left: 8px;
  }
</style>
