<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import type { VisualizationId } from '@/utils/VisualizationId'
import { findCommonPeriod } from '@/math/CommonPeriodFinder'
import type { InitialConditions } from '@/models/InitialConditions'
import DrawingCanvas from '@/components/DrawingCanvas.vue'
import { DrawingState, useSimulationStore } from '@/stores/simulation'

const simulationStore = useSimulationStore()

const { markDrawingAsFinished } = simulationStore
const { conditions, conditionsInput, isDrawing, timeSpeed, activeVisualization, drawingState, isFinished } = storeToRefs(simulationStore)

const props = defineProps({
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  }
})

const canvasRef = ref<typeof DrawingCanvas>()

const state = reactive({
  timeTicks: 0,
  maxTimeTicks: 0
})

function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}

// Pessimisticly large value to draw the whole curve
const DEFAULT_MAX_TIME_UNITS = 100
const TIME_TICKS_IN_TIME_UNIT = 5000
const CANVAS_PADDING_PX = 5
const DRAWING_BATCH_SIZE = 50


function findMaxTimeUnits(initialConditions: InitialConditions): number {
  let commonPeriod = findCommonPeriod(initialConditions.x.frequency, initialConditions.y.frequency)
  return commonPeriod || DEFAULT_MAX_TIME_UNITS
}

const MAXIMUM_STEP_DELAY_MS = 1000
async function stepDelay(timeSpeed: number) {
  const slowdownCoefficient = 1 - timeSpeed
  if (slowdownCoefficient > 0) {
    await sleep(Math.pow(slowdownCoefficient, 5) * MAXIMUM_STEP_DELAY_MS)
  }
}

async function startDrawing(): Promise<void> {
  const canvas = canvasRef.value!
  await canvas.clear()
  if (conditions.value != null && timeSpeed != null) {
    let maxTimeUnits = findMaxTimeUnits(conditions.value)
    state.maxTimeTicks = maxTimeUnits * TIME_TICKS_IN_TIME_UNIT
    state.timeTicks = 0
    continueDrawing(canvas)
  }
}

async function resumeDrawing(): Promise<void> {
  const canvas = canvasRef.value!
  continueDrawing(canvas)
}

async function continueDrawing(canvas: typeof DrawingCanvas) {
  if (conditions.value != null && timeSpeed != null) {
    const visualizationId = activeVisualization.value
    await drawNextPositionBatches(canvas, conditions.value, visualizationId)
    await finishDrawing(canvas, visualizationId)
  }
}

async function drawNextPositionBatches(canvas: typeof DrawingCanvas, initialConditions: InitialConditions, currentVisualizationId: VisualizationId | null) {
  let i = 0
  while (isDrawing.value && activeVisualization.value == currentVisualizationId && state.timeTicks < state.maxTimeTicks) {
      await drawNextPosition(canvas, initialConditions)
      i++
      if (i == DRAWING_BATCH_SIZE) {
        if (timeSpeed.value < 1) {
          await stepDelay(timeSpeed.value)
        }
        i = 0
      }
      state.timeTicks++
    }
}

async function drawNextPosition(canvas: typeof DrawingCanvas, initialConditions: InitialConditions) {
  let currentTime = state.timeTicks / TIME_TICKS_IN_TIME_UNIT
  const amplitude = props.width / 2 - CANVAS_PADDING_PX
  let x = amplitude * Math.cos(initialConditions.x.frequency * currentTime + initialConditions.x.phase)
  let y = amplitude * Math.cos(initialConditions.y.frequency * currentTime + initialConditions.y.phase)
  return canvas.drawBodyPosition(x, y)
}

async function finishDrawing(canvas: typeof DrawingCanvas, currentVisualizationId: VisualizationId | null) {
  if (activeVisualization.value == currentVisualizationId && state.timeTicks >= state.maxTimeTicks) {
      canvas.hideBob()
      markDrawingAsFinished()
    }
}

async function resetDrawing(): Promise<void> {
  const canvas = canvasRef.value!
  state.maxTimeTicks = 0
  state.timeTicks = 0
  canvas.clear()
}

watch(() => drawingState.value, function(state) {
  if (state == DrawingState.Started) {
    startDrawing()
  } else if (state == DrawingState.Resumed) {
    resumeDrawing()
  } else if (state == DrawingState.Initial) {
    resetDrawing()
  }
})

function getImageTitle(): string {
  const x = conditionsInput.value.x
  const y = conditionsInput.value.y
  return `lissajous-curve-${x.phase}-${y.phase}-${x.frequency}-${y.frequency}.png`
}

function downloadImage() {
  const canvas = canvasRef.value!
  canvas.downloadImage(getImageTitle())
}
</script>

<template>
  <v-container class="canvas">
    <v-row cols="12">
      <DrawingCanvas ref="canvasRef" :width="width" :height="height"></DrawingCanvas>
    </v-row>
    <v-row v-if="isFinished">
      <v-btn icon="mdi-download" size="small" @click="downloadImage"></v-btn>
    </v-row>
  </v-container>
</template>