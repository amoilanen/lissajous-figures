import { describe, expect, it, vi, beforeEach, afterEach, type Mock } from 'vitest'

import { initVuetify } from '@/plugins'

import DrawingCanvas, { type DrawingContext } from '@/components/DrawingCanvas.vue'
import { mount, VueWrapper } from '@vue/test-utils'

describe('Controls', () => {

  const width = 200;
  const height = 300;
  let wrapper: VueWrapper;
  let bobCtx: MockContext;
  let trailCtx: MockContext;
  let mockDownloadUrl: Mock & ((url: string, title: string) => void);

  class MockContext implements DrawingContext {
    operations: Array<string>;

    constructor() {
      this.fillStyle = 'default'
      this.operations = [];
    }

    fillStyle: string | CanvasGradient | CanvasPattern;
    clearRect(x: number, y: number, w: number, h: number): void {
      this.operations.push(`clearRect(${x},${y},${w},${h})`);
    }
    beginPath(): void {
      this.operations.push('beginPath');
    }
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void {
      this.operations.push(`arc(${x},${y},${radius},${startAngle},${endAngle})`);
    }
    fill(): void {
      this.operations.push(`fill`);
    }
  }

  beforeEach(async () => {
    vi.mock('@/utils/DownloadUtils', () => ({ downloadUrl: vi.fn() }));
    const { downloadUrl } = await import('@/utils/DownloadUtils');
    mockDownloadUrl = downloadUrl as Mock;

    wrapper = mount(DrawingCanvas, {
      props: {
        width,
        height
      },
      global: {
        plugins: [initVuetify()]
      }
    })
    bobCtx = new MockContext()
    trailCtx = new MockContext()
  })

  afterEach(() => {
    vi.restoreAllMocks();
  })

  function injectMocks() {
    let component = wrapper.findComponent(DrawingCanvas).vm
    component.setCtx(trailCtx, bobCtx)
    component.setRequestAnimationFrame(callback => {
      callback()
      return 0
    })
  }

  it('clear should clear both the bob and the trail canvases', async () => {
    injectMocks()

    let component = wrapper.findComponent(DrawingCanvas).vm
    await component.clear()
    expect(trailCtx.operations).toEqual([
      `clearRect(0,0,${width},${height})`
    ])
    expect(bobCtx.operations).toEqual([
      `clearRect(0,0,${width},${height})`
    ])
  })

  it('drawBodyPosition should draw the next position on the trail canvas and move the bob to this position on the bob canvas', async () => {
    injectMocks()

    let component = wrapper.findComponent(DrawingCanvas).vm
    await component.drawBodyPosition(10, 10)
    expect(trailCtx.operations).toEqual([
      'beginPath',
      `arc(110,160,2,0,${2 * Math.PI})`,
      'fill'
    ])
    expect(bobCtx.operations).toEqual([
      `clearRect(0,0,${width},${height})`,
      'beginPath',
      `arc(110,160,16,0,${2 * Math.PI})`,
      'fill',
    ])
  })

  it('hideBob should hide the bob on the bob canvas', async () => {
    injectMocks()

    let component = wrapper.findComponent(DrawingCanvas).vm
    await component.hideBob()
    expect(trailCtx.operations).toEqual([])
    expect(bobCtx.operations).toEqual([
      `clearRect(0,0,${width},${height})`
    ])
  })

  it('renders both canvases: for the trail and the bob', async () => {
    const bobCanvas = wrapper.find('.canvas-bob');
    expect(bobCanvas.exists()).toBeTruthy();
    const trailCanvas = wrapper.find('.canvas-trail');
    expect(trailCanvas.exists()).toBeTruthy();
  })

  it('should call downloadUrl with correct url and title when downloading image', () => {
    let component = wrapper.findComponent(DrawingCanvas).vm
    const imageTitle = "downloaded_image.svg"
    component.downloadImage(imageTitle);
    expect(mockDownloadUrl).toHaveBeenCalledWith(expect.stringContaining('data:application/octet-stream;base64'), imageTitle);
  })
});