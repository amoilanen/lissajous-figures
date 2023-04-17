<script setup lang="ts">
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
const amplitude = 300

function isInteger(x: number): boolean {
  return Math.floor(x) == x;
}

function gcd(x: number, y: number): number {
  let a = x
  let b = y
  let r = a % b
  while (r > 0) {
    a = b
    b = r
    r = a % b
  }
  return b
}

export default {
  methods: {
    render() {
      console.log(`Render with properties ${this.initialConditions}`)
      const canvas = document.getElementById('oscillator-plane') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');

      let periodX = (2 * Math.PI) / this.initialConditions.x.frequency
      let periodY = (2 * Math.PI) / this.initialConditions.y.frequency

      let maxTimeunits = 100; // Pessimisticly large value to draw the whole curve
      let timeTicksInTimeUnit = 1000
      let maxTime = maxTimeunits * timeTicksInTimeUnit

      console.log(`Default maxTimeunits = ${maxTimeunits}`)

      //TODO: Test
      //TODO: Illustration for why these formulas work
      // Optimization to find the minimal period to draw the figure
      if (isInteger(this.initialConditions.x.frequency) && isInteger(this.initialConditions.y.frequency)) {
        let frequencyGcd = gcd(this.initialConditions.x.frequency, this.initialConditions.y.frequency)
        let periodXTimes = this.initialConditions.x.frequency / frequencyGcd
        maxTimeunits = periodXTimes * periodX
        let timeTicksInFullPeriod = 20000
        timeTicksInTimeUnit = Math.ceil(1 / maxTimeunits) * timeTicksInFullPeriod
        maxTime = maxTimeunits * timeTicksInTimeUnit
      }

      console.log(`Optimized maxTimeunits = ${maxTimeunits}`)

      if (ctx) {
        ctx.clearRect(0, 0, this.width, this.height)
        for (let t = 0; t < maxTime; t++) {
          const normalizedT = t / timeTicksInTimeUnit
          let x = amplitude * Math.cos(this.initialConditions.x.frequency * normalizedT + this.initialConditions.x.phase)
          let y = amplitude * Math.cos(this.initialConditions.y.frequency * normalizedT + this.initialConditions.y.phase)
          let canvasX = x + this.width / 2
          let canvasY = y + this.height / 2
          ctx.fillRect(canvasX, canvasY,1,1);
        }
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
    <v-row cols="12">
      <span class="text-h6">{{initialConditions}}</span>
    </v-row>
  </v-container>
</template>

<style scoped>
  #oscillator-plane {
    border: 1px solid;
  }
</style>
