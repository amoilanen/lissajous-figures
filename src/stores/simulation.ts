import { defineStore } from 'pinia'
import { ref } from 'vue'

import { FrequencyAndPhaseInput, InitialConditions, InitialConditionsInput } from '@/models/InitialConditions'

const initialConditionsInput = new InitialConditionsInput(
  new FrequencyAndPhaseInput("15", "𝝅/2"),
  new FrequencyAndPhaseInput("5", "0")
)

export const useSimulationStore = defineStore('simulationStore', () => {
  const conditions = ref(null as InitialConditions | null)
  const conditionsInput = ref(initialConditionsInput)
  const timeSpeedMax = 1
  const timeSpeed = ref(timeSpeedMax)
  const isDrawing = ref(false)

  function updateConditions() {
    conditions.value = conditionsInput.value.parse()
  }

  function startedDrawing() {
    isDrawing.value = true
  }

  function finishedDrawing() {
    isDrawing.value = false
  }

  return { conditions, conditionsInput, timeSpeed, timeSpeedMax, isDrawing, startedDrawing, finishedDrawing, updateConditions }
})