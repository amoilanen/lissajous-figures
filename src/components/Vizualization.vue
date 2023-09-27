<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia';

import { findCommonPeriod } from '@/math/CommonPeriodFinder';
import type { InitialConditions } from '@/models/InitialConditions';
import DrawingCanvas from '@/components/DrawingCanvas.vue';
import { useSimulationStore } from '@/stores/simulation'

const simulationStore = useSimulationStore()

const { startedDrawing, finishedDrawing } = simulationStore
const { conditions, timeSpeed } = storeToRefs(simulationStore)

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

type VisualizationId = Number

const state = reactive({
  activeVisualization: null as (VisualizationId | null)
})

const canvasRef = ref<typeof DrawingCanvas | null>(null)

function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}

const MAX_VISUALIZATION_ID = 1000

function createRandomId(): VisualizationId {
  return Math.floor(Math.random() * MAX_VISUALIZATION_ID)
}

// Pessimisticly large value to draw the whole curve
const DEFAULT_MAX_TIME_UNITS = 100
const TIME_TICKS_IN_TIME_UNIT = 5000

function findMaxTimeUnits(initialConditions: InitialConditions): number {
  let commonPeriod = findCommonPeriod(initialConditions.x.frequency, initialConditions.y.frequency)
  return commonPeriod || DEFAULT_MAX_TIME_UNITS
}

async function iterateThroughTime(f: (currentTime: number, initialConditions: InitialConditions, slowdownCoefficient: number) => Promise<void>): Promise<void> {
  const visualizationId = createRandomId()
  state.activeVisualization = visualizationId
  if (conditions.value != null && timeSpeed != null) {
    let maxTimeunits = findMaxTimeUnits(conditions.value)
    let maxTime = maxTimeunits * TIME_TICKS_IN_TIME_UNIT
    let currentTime = 0
    startedDrawing()
    while (state.activeVisualization == visualizationId && currentTime < maxTime) {
      const slowdownCoefficient = 1 - timeSpeed.value
      await f(currentTime / TIME_TICKS_IN_TIME_UNIT, conditions.value, slowdownCoefficient)
      currentTime++
    }
    finishedDrawing()
  }
}

async function render(): Promise<void> {
  const batchSize = 50
  let i = 0
  const canvas = canvasRef.value! as typeof DrawingCanvas
  const amplitude = props.width / 2
  await canvas.clear()
  iterateThroughTime(async (currentTime, initialConditions, slowdownCoefficient) => {
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

watch(() => simulationStore.conditions, function(newVal, oldVal) {
  render()
})
</script>

<template>
  <v-container class="canvas">
    <v-row cols="12">
      <DrawingCanvas ref="canvasRef" :width="width" :height="height"></DrawingCanvas>
    </v-row>
  </v-container>
</template>