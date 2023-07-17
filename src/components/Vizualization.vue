<script setup lang="ts">
import { ref, watch } from 'vue'

import { findCommonPeriod } from '@/math/CommonPeriodFinder';
import { InitialConditions } from '@/models/InitialConditions';
import DrawingCanvas from '@/components/DrawingCanvas.vue';

const props = defineProps({
  initialConditions: {
    type: InitialConditions,
    required: true
  },
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

function findMaxTimeUnits(): number {
  let commonPeriod = findCommonPeriod(props.initialConditions.x.frequency, props.initialConditions.y.frequency)
  return commonPeriod || DEFAULT_MAX_TIME_UNITS
}

async function iterateThroughTime(f: (currentTime: number) => Promise<void>): Promise<void> {
  let maxTimeunits = findMaxTimeUnits()
  let maxTime = maxTimeunits * TIME_TICKS_IN_TIME_UNIT
  for (let currentTime = 0; currentTime < maxTime; currentTime++) {
    await f(currentTime / TIME_TICKS_IN_TIME_UNIT)
  }
}

async function render(): Promise<void> {
  const canvas = canvasRef.value! as typeof DrawingCanvas
  const amplitude = props.width / 2
  await canvas.clear()
  iterateThroughTime(async currentTime => {
    let x = amplitude * Math.cos(props.initialConditions.x.frequency * currentTime + props.initialConditions.x.phase)
    let y = amplitude * Math.cos(props.initialConditions.y.frequency * currentTime + props.initialConditions.y.phase)
    await canvas.drawPoint(x, y)
    await sleep(0.001)
  })
}

watch(() => props.initialConditions, function(newVal, oldVal) {
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