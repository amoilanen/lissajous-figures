<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { findCommonPeriod } from '@/math/CommonPeriodFinder'
import { InitialConditions } from '@/models/InitialConditions'
import DrawingCanvas from '@/components/DrawingCanvas.vue'
import { DrawingState, useSimulationStore } from '@/stores/simulation'

const simulationStore = useSimulationStore()

const { markDrawingAsFinished } = simulationStore
const { conditions, conditionsInput, isDrawing, timeSpeed, isFinished } = storeToRefs(simulationStore)

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

const canvasRef = ref<typeof DrawingCanvas | null>(null)

const state = reactive({
  currentTime: 0,
  maxTime: 0
})

function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}

// Pessimisticly large value to draw the whole curve
const DEFAULT_MAX_TIME_UNITS = 100
const TIME_TICKS_IN_TIME_UNIT = 5000
const CANVAS_PADDING_PX = 5

function findMaxTimeUnits(initialConditions: InitialConditions): number {
  let commonPeriod = findCommonPeriod(initialConditions.x.frequency, initialConditions.y.frequency)
  return commonPeriod || DEFAULT_MAX_TIME_UNITS
}

//TODO: Inline to continueDrawing?
async function iterateThroughTime(canvas: typeof DrawingCanvas, f: (currentTime: number, initialConditions: InitialConditions, slowdownCoefficient: number) => Promise<void>): Promise<void> {
  const visualizationId = simulationStore.activeVisualization
  if (conditions.value != null && timeSpeed != null) {
    while (isDrawing.value && simulationStore.activeVisualization == visualizationId && state.currentTime < state.maxTime) {
      const slowdownCoefficient = 1 - timeSpeed.value
      await f(state.currentTime / TIME_TICKS_IN_TIME_UNIT, conditions.value, slowdownCoefficient)
      state.currentTime++
    }
    if (simulationStore.activeVisualization == visualizationId && state.currentTime >= state.maxTime) {
      canvas.hideBob()
      markDrawingAsFinished()
    }
  }
}

async function continueDrawing(canvas: typeof DrawingCanvas) {
  const batchSize = 50
  const amplitude = props.width / 2 - CANVAS_PADDING_PX
  let i = 0
  return iterateThroughTime(canvas, async (currentTime, initialConditions, slowdownCoefficient) => {
      let x = amplitude * Math.cos(initialConditions.x.frequency * currentTime + initialConditions.x.phase)
      let y = amplitude * Math.cos(initialConditions.y.frequency * currentTime + initialConditions.y.phase)
      await canvas.drawPoint(x, y)
      i++;
      if (i == batchSize) {
        if (slowdownCoefficient > 0) {
          await sleep(slowdownCoefficient * 1000)
        }
        i = 0
      }
    })
}

async function startDrawing(): Promise<void> {
  const canvas = canvasRef.value! as typeof DrawingCanvas
  await canvas.clear()
  if (conditions.value != null && timeSpeed != null) {
    let maxTimeunits = findMaxTimeUnits(conditions.value)
    state.maxTime = maxTimeunits * TIME_TICKS_IN_TIME_UNIT
    state.currentTime = 0
    continueDrawing(canvas)
  }
}

async function resumeDrawing(): Promise<void> {
  const canvas = canvasRef.value! as typeof DrawingCanvas
  continueDrawing(canvas)
}

async function resetDrawing(): Promise<void> {
  const canvas = canvasRef.value! as typeof DrawingCanvas
  state.maxTime = 0
  state.currentTime = 0
  canvas.clear()
}

watch(() => simulationStore.drawingState, function(state) {
  if (state == DrawingState.Started) {
    startDrawing()
  } else if (state == DrawingState.Resumed) {
    resumeDrawing()
  } else if (state == DrawingState.Initial) {
    resetDrawing()
  }
})

function getDownloadableImageTitle(): string {
  const x = conditionsInput.value.x
  const y = conditionsInput.value.y
  return `lissajous-curve-${x.phase}-${y.phase}-${x.frequency}-${y.frequency}.png`
}

function downloadImage() {
  const canvas = canvasRef.value! as typeof DrawingCanvas
  canvas.downloadImage(getDownloadableImageTitle())
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