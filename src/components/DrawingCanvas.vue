<script setup lang="ts">
import { reactive, ref, onMounted, type Ref } from 'vue'
import { downloadUrl } from '@/utils/DownloadUtils'

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
  trailCtx: null as (null | CanvasRenderingContext2D),
  bobCtx: null as (null | CanvasRenderingContext2D)
})

const trail = ref(null)
const bob = ref(null)

function getCanvas(ref: Ref<null>): HTMLCanvasElement {
  const $el = ref.value!
  return $el as HTMLCanvasElement;
}

onMounted(() => {
  state.trailCtx = getCanvas(trail).getContext('2d');
  state.bobCtx = getCanvas(bob).getContext('2d');
})

async function clear() {
  requestAnimationFrame(() => {
    state.trailCtx!.clearRect(0, 0, props.width, props.height)
    state.bobCtx!.clearRect(0, 0, props.width, props.height)
  })
}

async function hideBob() {
  requestAnimationFrame(() => {
    state.bobCtx!.clearRect(0, 0, props.width, props.height)
  })
}

async function drawPoint(x: number, y: number, color: string = 'black', size: number = 2) {
  let canvasX = x + props.width / 2
  let canvasY = y + props.height / 2

  let trailCtx = state.trailCtx!
  let bobCtx = state.bobCtx!
  trailCtx.fillStyle = color
  bobCtx.fillStyle = color
  requestAnimationFrame(() => {
    trailCtx.beginPath()
    trailCtx.arc(canvasX, canvasY, size, 0, 2 * Math.PI)
    trailCtx.fill()
    bobCtx.clearRect(0, 0, props.width, props.height)
    bobCtx.beginPath()
    bobCtx.arc(canvasX, canvasY, size * 8, 0, 2 * Math.PI)
    bobCtx.fill()
  })
}

function downloadImage(title: string) {
  const canvas = getCanvas(trail)
  const url = canvas.toDataURL('image/png').replace(/^data:image\/png/,'data:application/octet-stream')
  downloadUrl(url, title)
}

defineExpose({
  clear,
  drawPoint,
  hideBob,
  downloadImage
})
</script>

<template>
  <canvas class="canvas-trail" ref="trail" :width="width" :height="height"></canvas>
  <canvas class="canvas-bob" ref="bob" :width="width" :height="height"></canvas>
</template>

<style scoped>
  canvas {
    border: 1px dotted;
  }
  .canvas-bob {
    position: absolute;
  }
</style>
