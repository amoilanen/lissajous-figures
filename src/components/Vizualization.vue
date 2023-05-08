<script setup lang="ts">
import { findCommonPeriod } from '@/math/CommonPeriodFinder';
import { InitialConditions } from '@/models/InitialConditions';

defineProps({
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
</script>

<script lang="ts">

function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}

// Pessimisticly large value to draw the whole curve
const DEFAULT_MAX_TIME_UNITS = 100
const TIME_TICKS_IN_TIME_UNIT = 5000

export default {
  methods: {
    findMaxTimeUnits(): number {
      let commonPeriod = findCommonPeriod(this.initialConditions.x.frequency, this.initialConditions.y.frequency)
      return commonPeriod || DEFAULT_MAX_TIME_UNITS
    },
    getDrawingContext(): CanvasRenderingContext2D | null {
      const canvas = document.getElementById('oscillator-plane') as HTMLCanvasElement;
      return canvas.getContext('2d');
    },
    drawPointOnCanvas(ctx: CanvasRenderingContext2D, x: number, y: number) {
      let canvasX = x + this.width / 2
      let canvasY = y + this.height / 2
      ctx.fillRect(canvasX, canvasY, 1, 1);
    },
    async iterateThroughTime(f: (currentTime: number) => Promise<void>) {
      let maxTimeunits = this.findMaxTimeUnits()
      let maxTime = maxTimeunits * TIME_TICKS_IN_TIME_UNIT
      for (let currentTimeUnit = 0; currentTimeUnit < maxTime; currentTimeUnit++) {
        const currentTime = currentTimeUnit / TIME_TICKS_IN_TIME_UNIT
        await f(currentTime)
      }
    },
    async render() {
      const ctx = this.getDrawingContext()
      const amplitude = this.width / 2

      if (ctx) {
        ctx.clearRect(0, 0, this.width, this.height)
        this.iterateThroughTime(async currentTime => {
           let x = amplitude * Math.cos(this.initialConditions.x.frequency * currentTime + this.initialConditions.x.phase)
           let y = amplitude * Math.cos(this.initialConditions.y.frequency * currentTime + this.initialConditions.y.phase)
           this.drawPointOnCanvas(ctx, x, y)
           //await sleep(0.001)
         })
      }
    }
  },
  watch: {
    initialConditions: function(newVal, oldVal) {
      this.render();
    }
  }
}
</script>

<template>
  <v-container class="canvas">
    <v-row cols="12">
      <canvas id="oscillator-plane" :width="width" :height="height"></canvas>
    </v-row>
  </v-container>
</template>

<style scoped>
  #oscillator-plane {
    border: 1px dotted;
  }
</style>
