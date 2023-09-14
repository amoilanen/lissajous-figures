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

  function updateConditions() {
    conditions.value = conditionsInput.value.parse()
  }

  return { conditions, conditionsInput, updateConditions }
})