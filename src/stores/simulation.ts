import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { FrequencyAndPhaseInput, InitialConditions, InitialConditionsInput } from '@/models/InitialConditions'

const initialConditionsInput = new InitialConditionsInput(
  new FrequencyAndPhaseInput("15", "𝝅/2"),
  new FrequencyAndPhaseInput("5", "0")
)

export enum DrawingState {
  Initial = "Initial",
  Started = "Started",
  Finished = "Finished",
  Stopped = "Stopped"
}

export const useSimulationStore = defineStore('simulationStore', () => {
  const conditions = ref(null as InitialConditions | null)
  const conditionsInput = ref(initialConditionsInput)
  const timeSpeedMax = 1
  const timeSpeed = ref(timeSpeedMax)
  const isDrawing = computed(() => drawingState.value == DrawingState.Started)

  const drawingState = ref(DrawingState.Initial)

  function updateConditions() {
    conditions.value = conditionsInput.value.parse()
  }

  function startedDrawing() {
    setDrawingState(DrawingState.Started)
  }

  function finishedDrawing() {
    setDrawingState(DrawingState.Finished)
  }

  function setDrawingState(newState: DrawingState) {
    let isInvalidTransition = false
    switch (drawingState.value) {
      case DrawingState.Initial:
        isInvalidTransition = newState != DrawingState.Started
        break
      case DrawingState.Started:
        isInvalidTransition = !(newState == DrawingState.Stopped || newState == DrawingState.Finished)
        break
      case DrawingState.Finished:
        isInvalidTransition = newState != DrawingState.Started
        break
      case DrawingState.Stopped:
        isInvalidTransition = newState != DrawingState.Started
        break
    }
    if (isInvalidTransition) {
      throw new Error(`Invalid drawing state transition ${drawingState.value} -> ${newState}`)
    } else {
      drawingState.value = newState
    }
  }

  return { conditions, conditionsInput, drawingState, timeSpeed, timeSpeedMax, isDrawing, startedDrawing, finishedDrawing, updateConditions }
})