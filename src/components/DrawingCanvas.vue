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

export interface DrawingContext {
  fillStyle: string | CanvasGradient | CanvasPattern
  clearRect(x: number, y: number, w: number, h: number): void
  beginPath(): void
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void
  fill(): void
}

const state = reactive({
  trailCtx: null as (null | DrawingContext),
  bobCtx: null as (null | DrawingContext),
  requestAnimationFrame: requestAnimationFrame as (callback: () => void) => number
})

const trailRef = ref<HTMLCanvasElement>()
const bobRef = ref<HTMLCanvasElement>()

function getCanvas(ref: Ref<HTMLCanvasElement| undefined>): HTMLCanvasElement {
  const $el = ref.value!
  return $el
}

function getContext(ref: Ref<HTMLCanvasElement| undefined>): CanvasRenderingContext2D | null {
  return getCanvas(ref).getContext('2d')
}

onMounted(() => {
  setCtx(getContext(trailRef), getContext(bobRef));
  setRequestAnimationFrame(requestAnimationFrame);
})

function setCtx(trailCtx: DrawingContext | null, bobCtx: DrawingContext | null) {
  state.trailCtx = trailCtx;
  state.bobCtx = bobCtx;
}

function setRequestAnimationFrame(requestAnimationFrame: (callback: () => void) => number) {
  state.requestAnimationFrame = requestAnimationFrame;
}

async function clear() {
  state.requestAnimationFrame(() => {
    state.trailCtx!.clearRect(0, 0, props.width, props.height)
    state.bobCtx!.clearRect(0, 0, props.width, props.height)
  })
}

async function hideBob() {
  state.requestAnimationFrame(() => {
    state.bobCtx!.clearRect(0, 0, props.width, props.height)
  })
}

async function drawBodyPosition(x: number, y: number, color: string = 'black', size: number = 2) {
  let canvasX = x + props.width / 2
  let canvasY = y + props.height / 2

  let trailCtx = state.trailCtx!
  let bobCtx = state.bobCtx!
  trailCtx.fillStyle = color
  bobCtx.fillStyle = color
  state.requestAnimationFrame(() => {
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
  const canvas = getCanvas(trailRef)
  const url = canvas.toDataURL('image/png').replace(/^data:image\/png/,'data:application/octet-stream')
  downloadUrl(url, title)
}

defineExpose({
  setCtx, // Made public for testing
  setRequestAnimationFrame, // Made public for testing
  clear,
  drawBodyPosition,
  hideBob,
  downloadImage
})
</script>

<template>
  <canvas class="canvas-trail" ref="trailRef" :width="width" :height="height"></canvas>
  <canvas class="canvas-bob" ref="bobRef" :width="width" :height="height"></canvas>
</template>

<style scoped>
  canvas {
    border: 1px dotted;
  }
  .canvas-bob {
    position: absolute;
  }
</style>
