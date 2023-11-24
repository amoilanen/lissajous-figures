<script setup lang="ts">
import { InitialConditionsInput, FrequencyAndPhaseInput } from '@/models/InitialConditions'

const emit = defineEmits<{
  (e: 'conditions-selected', conditions: InitialConditionsInput): void,
}>()

const predefinedInputsLegend = `$$\\omega_x:\\omega_x \\phi_x \\phi_y$$`

const possibleRatios = ['1:1', '1:2', '1:3', '2:3', '3:4', '3:5', '4:5', '5:6']
const phases = ['0', '𝝅/4', '𝝅/2', '3𝝅/4', '𝝅']

const predefinedInputs = possibleRatios.flatMap((ratio) => {
  return phases.flatMap(phase => 
    [`${ratio} ${phase} 0`]
  )
})

function onSelected(predefinedInput: string) {
  const parsedInput = predefinedInput.split(' ')
  const frequencies = parsedInput[0].split(':').map(value => parseInt(value, 10) * 10)
  const frequencyX = frequencies[0]
  const frequencyY = frequencies[1]
  const phaseX = parsedInput[1]
  const phaseY = parsedInput[2]

  const predefinedConditionsInput = new InitialConditionsInput(
    new FrequencyAndPhaseInput(frequencyX.toString(), phaseX),
    new FrequencyAndPhaseInput(frequencyY.toString(), phaseY)
  )
  emit('conditions-selected', predefinedConditionsInput)
}
</script>

<template>
  <v-container class="mx-2">
    <v-row>
      <label>Predefined curve parameters format:</label>
      <vue-mathjax class="pr-3" id="inputs-legend" :formula="predefinedInputsLegend" />
    </v-row>
    <v-row>
      <v-select
        :items="predefinedInputs"
        density="compact"
        label="Select a predefined curve"
        @update:model-value="onSelected"
      ></v-select>
    </v-row>
  </v-container>
</template>