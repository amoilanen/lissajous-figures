import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { InitialConditions } from '@/models/InitialConditions'

export const useSimulationStore = defineStore('simulationStore', () => {
  const conditions = ref(null as InitialConditions | null)

  function updateConditions(updated: InitialConditions): void {
    conditions.value = updated
  }

  return { conditions, updateConditions }
})