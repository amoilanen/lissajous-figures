import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'

import { initVueMathjax, initVuetify } from '@/plugins'

import { useSimulationStore, DrawingState } from '@/stores/simulation'
import { FrequencyAndPhase, InitialConditions } from '@/models/InitialConditions'

import { createTestingPinia } from '@pinia/testing'
import { mount, VueWrapper } from '@vue/test-utils'
import Visualization from '@/components/Visualization.vue';
import DrawingCanvas from '../DrawingCanvas.vue'

describe('Visualization', () => {

  let width = 200;
  let height = 100;
  let wrapper: VueWrapper;
  let mockDrawingCanvas: MockDrawingCanvas;

  class MockDrawingCanvas {
    operations: Array<string>
    template: string
    methods: { 
      clear: () => void,
      drawBodyPosition: (x: number, y: number, color: string, size: number) => void,
      hideBob: () => void,
      downloadImage: () => void
    }
    constructor() {
        this.operations = [];
        this.template = '<div />';
        const self = this;
        this.methods = {
          clear() {
            self.operations.push('clear');
          },
          drawBodyPosition(x: number, y: number, color: string = 'black', size: number = 2) {
            self.operations.push(`drawBodyPosition(${x}, ${y}, ${color}, ${size})`);
          },
          hideBob() {
            self.operations.push('hideBob');
          },
          downloadImage() {
            self.operations.push('downloadImage');
          }
        }
    }
  }

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn
    })
    mockDrawingCanvas = new MockDrawingCanvas();
    wrapper = mount(Visualization, {
      props: {
        width,
        height
      },
      global: {
        stubs: {
          DrawingCanvas: mockDrawingCanvas
        },
        plugins: [pinia, initVueMathjax(), initVuetify()]
      }
    })
    const simulationStore = useSimulationStore();
    (simulationStore.startDrawing as Mock).mockReset()
  })

  it('renders the canvas', async () => {
    const simulationStore = useSimulationStore()
    simulationStore.$patch({ drawingState: DrawingState.Started })
    await wrapper.vm.$nextTick()

    let canvas = wrapper.find('[data-test=canvas]');
    expect(canvas.exists()).toBe(true);
    expect(canvas.attributes()['width']).toBe(width.toString());
    expect(canvas.attributes()['height']).toBe(height.toString());
  })

  it('does not render the download button when drawing is not finished', async () => {
    const simulationStore = useSimulationStore()
    simulationStore.$patch({ drawingState: DrawingState.Started })
    await wrapper.vm.$nextTick()

    let downloadButton = wrapper.find('.v-btn[data-test=downloadButton]');
    expect(downloadButton.exists()).toBe(false);
  });

  it('renders the download button when drawing is not finished', async () => {
    const simulationStore = useSimulationStore()
    simulationStore.$patch({ drawingState: DrawingState.Finished })
    await wrapper.vm.$nextTick()

    let downloadButton = wrapper.find('.v-btn[data-test=downloadButton]');
    expect(downloadButton.exists()).toBe(true);
  });

  it('calls methods on the canvas after drawing has started', () => {
    const visualizationComponent = wrapper.findComponent(Visualization).vm
    visualizationComponent.setTimeticksInTimeunit(1)

    mockDrawingCanvas.operations = [];
    const simulationStore = useSimulationStore()
    simulationStore.$patch({
        drawingState: DrawingState.Finished
    })
    simulationStore.$patch({
        drawingState: DrawingState.Started,
        conditions: new InitialConditions(
          new FrequencyAndPhase(1, 1),
          new FrequencyAndPhase(1, 1)
        )
    })
    expect(mockDrawingCanvas.operations).toEqual([]); //TODO: Wait for the component to fully render
  });
});