<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { findCommonPeriod } from '@/math/CommonPeriodFinder'
import type { InitialConditions } from '@/models/InitialConditions'
import DrawingCanvas from '@/components/DrawingCanvas.vue'
import { useSimulationStore, DrawingState } from '@/stores/simulation'

const simulationStore = useSimulationStore()

const { finishedDrawing } = simulationStore
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

const canvasRef = ref<typeof DrawingCanvas | null>(null)

function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}

// Pessimisticly large value to draw the whole curve
const DEFAULT_MAX_TIME_UNITS = 100
const TIME_TICKS_IN_TIME_UNIT = 5000

function findMaxTimeUnits(initialConditions: InitialConditions): number {
  let commonPeriod = findCommonPeriod(initialConditions.x.frequency, initialConditions.y.frequency)
  return commonPeriod || DEFAULT_MAX_TIME_UNITS
}

async function iterateThroughTime(f: (currentTime: number, initialConditions: InitialConditions, slowdownCoefficient: number) => Promise<void>): Promise<void> {
  const visualizationId = simulationStore.activeVisualization
  if (conditions.value != null && timeSpeed != null) {
    let maxTimeunits = findMaxTimeUnits(conditions.value)
    let maxTime = maxTimeunits * TIME_TICKS_IN_TIME_UNIT
    let currentTime = 0
    while (simulationStore.activeVisualization == visualizationId && currentTime < maxTime) {
      const slowdownCoefficient = 1 - timeSpeed.value
      await f(currentTime / TIME_TICKS_IN_TIME_UNIT, conditions.value, slowdownCoefficient)
      currentTime++
    }
    if (simulationStore.activeVisualization == visualizationId) {
      finishedDrawing()
    }
  }
}

async function visualize(): Promise<void> {
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

watch(() => simulationStore.activeVisualization, function(newVal, oldVal) {
  if (newVal != oldVal && simulationStore.isDrawing) {
    visualize()
  }
})
</script>

<template>
  <v-container class="canvas">
    <v-row cols="12">
      <DrawingCanvas ref="canvasRef" :width="width" :height="height"></DrawingCanvas>
    </v-row>
  </v-container>
</template>