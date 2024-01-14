import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

import { FrequencyAndPhaseInput, InitialConditions, InitialConditionsInput } from '@/models/InitialConditions'
import type { VisualizationId } from '@/utils/VisualizationId'
import { createRandomVisualizationId } from '@/utils/VisualizationId'
import { delay } from '@/utils/AsyncUtils'

export enum DrawingState {
  Initial = "Initial",
  Started = "Started",
  Resumed = "Resumed",
  Finished = "Finished",
  Paused = "Paused"
}

export const defaultInitialConditionsInput = new InitialConditionsInput(
  new FrequencyAndPhaseInput("15", "𝝅/2"),
  new FrequencyAndPhaseInput("5", "0")
)

export const useSimulationStore = defineStore('simulationStore', () => {
  const drawingState = ref(DrawingState.Initial)
  const activeVisualization = ref(null as (VisualizationId | null))

  const conditions = ref(null as InitialConditions | null)
  const conditionsInput = ref(defaultInitialConditionsInput.clone())
  const timeSpeedMax = 1
  const timeSpeed = ref(timeSpeedMax)

  const isDrawing = computed(() => [DrawingState.Started, DrawingState.Resumed].includes(drawingState.value))
  const isFinished = computed(() => drawingState.value == DrawingState.Finished)

  watch(conditionsInput.value, () => {
    resetDrawing()
  })

  async function startDrawing() {
    // Automatically stop any active drawing
    resetDrawing()
    await delay(0)
    resetDrawing()
    setDrawingState(DrawingState.Started)
    updateConditions()
    activeVisualization.value = createRandomVisualizationId()
  }

  function pauseDrawing() {
    setDrawingState(DrawingState.Paused)
  }

  function resumeDrawing() {
    setDrawingState(DrawingState.Resumed)
  }

  function markDrawingAsFinished() {
    setDrawingState(DrawingState.Finished)
    activeVisualization.value = null
  }

  function resetDrawing() {
    if (drawingState.value != DrawingState.Initial) {
      setDrawingState(DrawingState.Initial)
    }
    activeVisualization.value = null
  }

  function updateConditions() {
    conditions.value = conditionsInput.value.parse()
  }

  const VALID_TRANSITIONS = {
    [DrawingState.Initial]: [DrawingState.Started],
    [DrawingState.Started]: [DrawingState.Paused, DrawingState.Finished, DrawingState.Initial],
    [DrawingState.Resumed]: [DrawingState.Started, DrawingState.Paused, DrawingState.Finished, DrawingState.Initial],
    [DrawingState.Paused]: [DrawingState.Started, DrawingState.Resumed, DrawingState.Initial],
    [DrawingState.Finished]: [DrawingState.Started, DrawingState.Initial]
  }

  function setDrawingState(newState: DrawingState) {
    const isValidTransition = VALID_TRANSITIONS[drawingState.value]?.indexOf(newState) >= 0
    if (isValidTransition) {
      drawingState.value = newState
    } else {
      throw new Error(`Invalid drawing state transition ${drawingState.value} -> ${newState}`)
    }
  }

  const state = {
    conditions,
    conditionsInput,
    drawingState,
    activeVisualization,
    timeSpeed,
    timeSpeedMax,
    isDrawing,
    isFinished
  }

  const actions = {
    markDrawingAsFinished,
    startDrawing,
    pauseDrawing,
    resumeDrawing,
    resetDrawing
  }

  return { ...state, ...actions }
})