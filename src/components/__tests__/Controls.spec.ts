import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { InitialConditionsInput, FrequencyAndPhaseInput } from '@/models/InitialConditions'

import { initVueMathjax, initVuetify } from '@/plugins'
import { VSelect } from 'vuetify/components';

import Controls from '@/components/Controls.vue'
import { useSimulationStore } from '@/stores/simulation'

import { storeToRefs } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { mount, VueWrapper } from '@vue/test-utils'

describe('Controls', () => {

  let wrapper: VueWrapper;

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn
    })
    wrapper = mount(Controls, {
      global: {
        plugins: [pinia, initVueMathjax(), initVuetify()]
      }
    })
  })

  //TODO: Renders default values, assert that the state ot the store is rendered

  it('should be possible to select one of the predefined inputs', async () => {
    const simulationStore = useSimulationStore();
    (simulationStore.startDrawing as Mock).mockReset()
    const selectWrapper = wrapper.findComponent(VSelect) // Also possible to use the CSS selector .v-select
    expect(selectWrapper.exists()).toBe(true)
    const select = selectWrapper.vm as VSelect

    const lastPredefinedInput = select.items[select.items.length - 1]
    expect(lastPredefinedInput).to.equal('5:6 𝝅 0')

    select.select({ value: lastPredefinedInput, title: lastPredefinedInput})

    await select.$nextTick()

    let phaseXInput = wrapper.find('.v-text-field[data-test=phaseX] input').element as HTMLInputElement
    expect(phaseXInput.value).toBe('𝝅')
    let frequencyXInput = wrapper.find('.v-text-field[data-test=frequencyX] input').element as HTMLInputElement
    expect(frequencyXInput.value).toBe('50')
    let phaseYInput = wrapper.find('.v-text-field[data-test=phaseY] input').element as HTMLInputElement
    expect(phaseYInput.value).toBe('0')
    let frequencyYInput = wrapper.find('.v-text-field[data-test=frequencyY] input').element as HTMLInputElement
    expect(frequencyYInput.value).toBe('60')

    const { conditionsInput } = storeToRefs(simulationStore)
    expect(conditionsInput.value).toEqual(new InitialConditionsInput(
      new FrequencyAndPhaseInput("50", "𝝅"),
      new FrequencyAndPhaseInput("60", "0")
    ))
    expect(simulationStore.startDrawing).toHaveBeenCalledTimes(1)
  });

  //TODO: When drawing is active Pause is enabled
  //TODO: When drawing is not active Draw is enabled
  //TODO: When drawing is paused both Draw and Resume are enabled
  //TODO: If some input is invalid, then Draw is disabled
  //TODO: Changing speed updates speed in the store
  //TODO: Changing inputs updates inputs in the store
    //timespeed
    //phaseX
    //frequencyX
    //phaseY
    //frequencyY
});