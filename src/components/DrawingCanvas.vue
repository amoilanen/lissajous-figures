<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

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

const state = reactive({
  ctx: null as (null | CanvasRenderingContext2D)
})

const root = ref(null)

onMounted(() => {
  const $el = root.value!
  const canvas = $el as HTMLCanvasElement;
  state.ctx = canvas.getContext('2d');
})

async function clear() {
  state.ctx?.clearRect(0, 0, props.width, props.height)
}

async function drawPoint(x: number, y: number) {
  let canvasX = x + props.width / 2
  let canvasY = y + props.height / 2
  state.ctx?.fillRect(canvasX, canvasY, 1, 1);
}

defineExpose({
  clear,
  drawPoint
})
</script>

<template>
  <canvas ref="root" :width="width" :height="height"></canvas>
</template>

<style scoped>
  canvas {
    border: 1px dotted;
  }
</style>
