<script setup lang="ts">
import { InitialConditionsInput, FrequencyAndPhaseInput } from '@/models/InitialConditions'

const emit = defineEmits<{
  (e: 'conditions-selected', conditions: InitialConditionsInput): void,
}>()

function getPredefinedInputs(ratios: Array<String>, phases: Array<String>) {
  return ratios.flatMap(ratio => {
    return phases.flatMap(phase => 
      [`${ratio} ${phase} 0`]
    )
  })
}

function parseInputs(inputs: Array<string>): { [key: string]: InitialConditionsInput} {
  const parsedInputPairs: Array<[string, InitialConditionsInput]> = inputs.map(input => {
  const splitInput = input.split(' ')
  const frequencies = splitInput[0].split(':').map(value => parseInt(value, 10) * 10)
  const frequencyX = frequencies[0]
  const frequencyY = frequencies[1]
  const phaseX = splitInput[1]
  const phaseY = splitInput[2]

  const parsedInput = new InitialConditionsInput(
    new FrequencyAndPhaseInput(frequencyX.toString(), phaseX),
    new FrequencyAndPhaseInput(frequencyY.toString(), phaseY)
  )
  return [input, parsedInput]
})

  return parsedInputPairs.reduce((acc, [predefinedInput, parsedInput]) => {
    acc[predefinedInput] = parsedInput
    return acc
  }, {} as { [key: string]: InitialConditionsInput})
}

const predefinedInputsLegend = `$$\\omega_x:\\omega_x \\phi_x \\phi_y$$`

const possibleRatios = ['1:1', '1:2', '1:3', '2:3', '3:4', '3:5', '4:5', '5:6']
const phases = ['0', '𝝅/4', '𝝅/2', '3𝝅/4', '𝝅']

const predefinedInputs = getPredefinedInputs(possibleRatios, phases)
const parsedInputs = parseInputs(predefinedInputs)

function onSelected(predefinedInput: string) {
  const predefinedConditionsInput = parsedInputs[predefinedInput]
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