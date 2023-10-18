import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { FrequencyAndPhaseInput, InitialConditions, InitialConditionsInput } from '@/models/InitialConditions'
import type { VisualizationId } from '@/utils/VisualizationId'
import { createRandomVisualizationId } from '@/utils/VisualizationId'

export enum DrawingState {
  Initial = "Initial",
  Started = "Started",
  Resumed = "Resumed",
  Finished = "Finished",
  Stopped = "Stopped"
}

export const useSimulationStore = defineStore('simulationStore', () => {

  const defaultInitialConditionsInput = new InitialConditionsInput(
    new FrequencyAndPhaseInput("15", "𝝅/2"),
    new FrequencyAndPhaseInput("5", "0")
  )

  const activeVisualization = ref(null as (VisualizationId | null))
  const conditions = ref(null as InitialConditions | null)
  const conditionsInput = ref(defaultInitialConditionsInput)
  const timeSpeedMax = 1
  const timeSpeed = ref(timeSpeedMax)
  const isDrawing = computed(() => [DrawingState.Started, DrawingState.Resumed].indexOf(drawingState.value) >= 0)
  const drawingState = ref(DrawingState.Initial)

  function startDrawing() {
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
  }

  function resumeDrawing() {
    setDrawingState(DrawingState.Resumed)
  }

  function markDrawingAsFinished() {
    setDrawingState(DrawingState.Finished)
    activeVisualization.value = null
  }

  function updateConditions() {
    conditions.value = conditionsInput.value.parse()
  }

  const VALID_TRANSITIONS = {
    [DrawingState.Initial]: [DrawingState.Started],
    [DrawingState.Started]: [DrawingState.Stopped, DrawingState.Finished],
    [DrawingState.Resumed]: [DrawingState.Stopped, DrawingState.Finished],
    [DrawingState.Stopped]: [DrawingState.Started, DrawingState.Resumed],
    [DrawingState.Finished]: [DrawingState.Started]
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
    defaultInitialConditionsInput,
    conditions,
    conditionsInput,
    drawingState,
    activeVisualization,
    timeSpeed,
    timeSpeedMax,
    isDrawing
  }

  const actions = {
    markDrawingAsFinished,
    startDrawing,
    stopDrawing,
    resumeDrawing
  }

  return { ...state, ...actions }
})