
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { InitialConditionsInput, FrequencyAndPhaseInput } from '@/models/InitialConditions'

import { initVueMathjax, initVuetify } from '@/plugins'
import { VSelect, VBtn, VTextField } from 'vuetify/components';

import Controls from '@/components/Controls.vue'
import { useSimulationStore, defaultInitialConditionsInput, DrawingState } from '@/stores/simulation'

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
    const simulationStore = useSimulationStore();
    (simulationStore.startDrawing as Mock).mockReset()
  })

  it('renders the default values from the store', async() => {
    let phaseXInput = wrapper.find('.v-text-field[data-test=phaseX] input').element as HTMLInputElement
    expect(phaseXInput.value).toBe(defaultInitialConditionsInput.x.phase)
    let frequencyXInput = wrapper.find('.v-text-field[data-test=frequencyX] input').element as HTMLInputElement
    expect(frequencyXInput.value).toBe(defaultInitialConditionsInput.x.frequency)
    let phaseYInput = wrapper.find('.v-text-field[data-test=phaseY] input').element as HTMLInputElement
    expect(phaseYInput.value).toBe(defaultInitialConditionsInput.y.phase)
    let frequencyYInput = wrapper.find('.v-text-field[data-test=frequencyY] input').element as HTMLInputElement
    expect(frequencyYInput.value).toBe(defaultInitialConditionsInput.y.frequency)

    const simulationStore = useSimulationStore()
    expect(simulationStore.conditionsInput).toEqual(defaultInitialConditionsInput)
    expect(simulationStore.startDrawing).not.toHaveBeenCalled()
  })

  it('should be possible to select one of the predefined inputs', async () => {
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

    const simulationStore = useSimulationStore()
    const { conditionsInput } = storeToRefs(simulationStore)
    expect(conditionsInput.value).toEqual(new InitialConditionsInput(
      new FrequencyAndPhaseInput('50', '𝝅'),
      new FrequencyAndPhaseInput('60', '0')
    ))
    expect(simulationStore.startDrawing).toHaveBeenCalledTimes(1)
  });

  it('Start and Pause are enabled when drawing is active', async () => {
    const simulationStore = useSimulationStore()
    simulationStore.$patch({ drawingState: DrawingState.Started })

    await wrapper.vm.$nextTick()

    const drawButton = wrapper.findComponent('.v-btn[data-test=draw]').findComponent(VBtn)
    expect(drawButton.vm.$props.disabled).toBe(false)
    expect(drawButton.text()).toBe('Draw')
    const pauseResumeButton = wrapper.findComponent('.v-btn[data-test=pauseOrResume]').findComponent(VBtn)
    expect(pauseResumeButton.vm.$props.disabled).toBe(false)
    expect(pauseResumeButton.text()).toBe('Pause')
  });

  it('Start is enabled, Pause disabled when drawing has finished', async () => {
    const simulationStore = useSimulationStore()
    simulationStore.$patch({ drawingState: DrawingState.Finished })

    await wrapper.vm.$nextTick()

    const drawButton = wrapper.findComponent('.v-btn[data-test=draw]').findComponent(VBtn)
    expect(drawButton.vm.$props.disabled).toBe(false)
    expect(drawButton.text()).toBe('Draw')
    const pauseResumeButton = wrapper.findComponent('.v-btn[data-test=pauseOrResume]').findComponent(VBtn)
    expect(pauseResumeButton.vm.$props.disabled).toBe(true)
    expect(pauseResumeButton.text()).toBe('Pause')
  });

  it('Start is enabled, Pause disabled when drawing has not yet been started', async () => {
    const simulationStore = useSimulationStore()
    simulationStore.$patch({ drawingState: DrawingState.Initial })

    await wrapper.vm.$nextTick()

    const drawButton = wrapper.findComponent('.v-btn[data-test=draw]').findComponent(VBtn)
    expect(drawButton.vm.$props.disabled).toBe(false)
    expect(drawButton.text()).toBe('Draw')
    const pauseResumeButton = wrapper.findComponent('.v-btn[data-test=pauseOrResume]').findComponent(VBtn)
    expect(pauseResumeButton.vm.$props.disabled).toBe(true)
    expect(pauseResumeButton.text()).toBe('Pause')
  });

  it('Start, Resume are enabled when drawing is paused', async () => {
    const simulationStore = useSimulationStore()
    simulationStore.$patch({ drawingState: DrawingState.Paused })

    await wrapper.vm.$nextTick()

    const drawButton = wrapper.findComponent('.v-btn[data-test=draw]').findComponent(VBtn)
    expect(drawButton.vm.$props.disabled).toBe(false)
    expect(drawButton.text()).toBe('Draw')
    const pauseResumeButton = wrapper.findComponent('.v-btn[data-test=pauseOrResume]').findComponent(VBtn)
    expect(pauseResumeButton.vm.$props.disabled).toBe(false)
    expect(pauseResumeButton.text()).toBe('Resume')
  });

  it('should disable Draw and Pause buttons, show error when frequency x input is invalid', async () => {
    let component = wrapper.findComponent(Controls).vm;

    let frequencyXInput = wrapper.find('.v-text-field[data-test=frequencyX] input')
    frequencyXInput.setValue('abc')

    await wrapper.vm.$nextTick()
    await component.controlsForm?.validate();

    expect(component.state.areInputsValid).toBe(false);

    let frequencyXInputMessages = wrapper.find('.v-text-field[data-test=frequencyX] .v-messages')
    expect(frequencyXInputMessages.text()).toEqual('Should be a number')

    const drawButton = wrapper.findComponent('.v-btn[data-test=draw]').findComponent(VBtn)
    expect(drawButton.vm.$props.disabled).toBe(true)
    expect(drawButton.text()).toBe('Draw')
    const pauseResumeButton = wrapper.findComponent('.v-btn[data-test=pauseOrResume]').findComponent(VBtn)
    expect(pauseResumeButton.vm.$props.disabled).toBe(true)
    expect(pauseResumeButton.text()).toBe('Pause')

    const simulationStore = useSimulationStore()
    const { conditionsInput } = storeToRefs(simulationStore)
    expect(conditionsInput.value.x.frequency).toEqual('abc')
  });

  //TODO: Test the cases when other inputs are invalid

  //TODO: Changing speed updates speed in the store
  //TODO: Changing inputs updates inputs in the store
    //timespeed
    //phaseX
    //frequencyX
    //phaseY
    //frequencyY
});