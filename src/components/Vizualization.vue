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

export default {
  methods: {
    render() {
      console.log(`Render with properties ${this.initialConditions}`)
      const canvas = document.getElementById('oscillator-plane') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        let currentPoint = null;
        ctx.clearRect(0, 0, this.width, this.height)
        for (let t = 0; t < 10000; t++) {
          const normalizedT = t / 100 
          let x = amplitude * Math.cos(this.initialConditions.x.frequency * normalizedT + this.initialConditions.x.phase)
          let y = amplitude * Math.cos(this.initialConditions.y.frequency * normalizedT + this.initialConditions.y.phase)
          let canvasX = x + this.width / 2
          let canvasY = y + this.height / 2
          if (currentPoint) {
            ctx.beginPath();
            ctx.moveTo(currentPoint.x, currentPoint.y)
            ctx.lineTo(canvasX, canvasY)
            ctx.stroke();
          }
          currentPoint = {
            x: canvasX,
            y: canvasY
          }
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
