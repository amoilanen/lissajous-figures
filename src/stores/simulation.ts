import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { FrequencyAndPhaseInput, InitialConditions, InitialConditionsInput } from '@/models/InitialConditions'
import type { VisualizationId } from '@/utils/VisualizationId'
import { createRandomVisualizationId } from '@/utils/VisualizationId'

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
  const activeVisualization = ref(null as (VisualizationId | null))
  const conditions = ref(null as InitialConditions | null)
  const conditionsInput = ref(initialConditionsInput)
  const timeSpeedMax = 1
  const timeSpeed = ref(timeSpeedMax)
  const isDrawing = computed(() => drawingState.value == DrawingState.Started)

  const drawingState = ref(DrawingState.Initial)

  function draw() {
    // Automatically stop any active drawing
    if (drawingState.value == DrawingState.Started) {
      setDrawingState(DrawingState.Stopped)
    }
    setDrawingState(DrawingState.Started)
    updateConditions()
    activeVisualization.value = createRandomVisualizationId()
  }

  function stopDrawing() {
    setDrawingState(DrawingState.Stopped)
    activeVisualization.value = null
  }

  function finishedDrawing() {
    setDrawingState(DrawingState.Finished)
  }

  function updateConditions() {
    conditions.value = conditionsInput.value.parse()
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

  return { conditions, conditionsInput, drawingState, activeVisualization, timeSpeed, timeSpeedMax, isDrawing, finishedDrawing, draw, stopDrawing }
})