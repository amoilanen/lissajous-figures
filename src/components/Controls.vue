<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { FrequencyAndPhaseInput, InitialConditions, InitialConditionsInput } from '@/models/InitialConditions'
import { useSimulationStore } from '@/stores/simulation'

const simulationStore = useSimulationStore()

const initialConditionsInput = new InitialConditionsInput(
  new FrequencyAndPhaseInput("15", "𝝅/2"),
  new FrequencyAndPhaseInput("5", "0")
)

const emit = defineEmits<{
  (e: 'time-speed-change', speed: number): void
}>()

const props = defineProps({
  canStopDrawing: {
    type: Boolean
  }
})

function numberValidation(value: string): boolean | string {
  if (/[\d𝝅\.]+/.test(value))
    return true
  else
    return "Should be a number"
}

const timeSpeedMax = 1
const state = reactive({
  timeSpeed: timeSpeedMax,
  areInputsValid: true,
  conditionsInput: initialConditionsInput,
  rules: {
    frequency: [ numberValidation ],
    phase: [ numberValidation ]
  }
})

const controlsForm = ref<HTMLFormElement | null>(null)

onMounted(async () => {
  await controlsForm.value!.validate()
  if (state.areInputsValid) {
    updateConditions()
    updateTimeSpeed()
  }
})

function updateConditions() {
  simulationStore.updateConditions(state.conditionsInput.parse())
}

function stopDrawing() {
  //TODO: Implement
  console.log("Stopping drawing...")
}

function updateTimeSpeed() {
  emit("time-speed-change", state.timeSpeed)
}

watch(() => state.timeSpeed, () =>
  updateTimeSpeed()
)

</script>

<template>
  <v-form ref="controlsForm" v-model="state.areInputsValid">
    <v-container class="controls">
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="state.conditionsInput.x.phase" :rules="state.rules.phase" label="x initial phase"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="state.conditionsInput.x.frequency" :rules="state.rules.frequency" label="x frequency"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="state.conditionsInput.y.phase" :rules="state.rules.phase" label="y initial phase"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="state.conditionsInput.y.frequency" :rules="state.rules.frequency" label="y frequency"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-btn @click="updateConditions" :disabled="!state.areInputsValid">Draw</v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn @click="stopDrawing" :disabled="!props.canStopDrawing">Stop</v-btn>
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
            v-model="state.timeSpeed"
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
