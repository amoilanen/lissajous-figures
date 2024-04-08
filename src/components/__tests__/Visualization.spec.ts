import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'

import { initVueMathjax, initVuetify } from '@/plugins'

import { useSimulationStore, DrawingState } from '@/stores/simulation'

import { createTestingPinia } from '@pinia/testing'
import { mount, VueWrapper } from '@vue/test-utils'
import Visualization from '@/components/Visualization.vue';
import DrawingCanvas from '../DrawingCanvas.vue'

describe('Visualization', () => {

  let width = 200;
  let height = 100;
  let wrapper: VueWrapper;
  let mockDrawingCanvas;

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn
    })
    mockDrawingCanvas = {
      template: '<div />',
      methods: {
        clear: vi.fn(),
        drawBodyPosition: vi.fn(), //TODO: Record the actual drawn positions?
        hideBob: vi.fn(),
        downloadImage: vi.fn(),
      }
    };
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
});