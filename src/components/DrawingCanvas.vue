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

function getCanvas(): HTMLCanvasElement {
  const $el = root.value!
  return $el as HTMLCanvasElement;
}

onMounted(() => {
  state.ctx = getCanvas().getContext('2d');
})

async function clear() {
  state.ctx!.clearRect(0, 0, props.width, props.height)
}

async function drawPoint(x: number, y: number, color: string = 'black', size: number = 2) {
  let canvasX = x + props.width / 2
  let canvasY = y + props.height / 2

  let ctx = state.ctx!
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, size, 0, 2 * Math.PI);
  ctx.fill();
}

function downloadImage() {
  const canvas = getCanvas()
  const url = canvas.toDataURL('image/png').replace(/^data:image\/png/,'data:application/octet-stream')

  //TODO: Extract method "downloadUrl"
  const downloadLink = document.createElement('a')
  downloadLink.setAttribute('download', 'LissajousCurve.png')
  downloadLink.setAttribute('href', url)
  downloadLink.click()
}

defineExpose({
  clear,
  drawPoint,
  downloadImage
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
