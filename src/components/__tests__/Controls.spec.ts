import { nextTick } from 'vue'

import { describe, expect, it, beforeAll, beforeEach, vi } from 'vitest'

import { initPlugins } from '@/plugins'
import { VSelect } from 'vuetify/components';

import Controls from '@/components/Controls.vue'

import { createTestingPinia } from '@pinia/testing'
import { mount, VueWrapper } from '@vue/test-utils'

const defaultPlugins = initPlugins()

describe('Explanation', () => {

  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = mount(Controls, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
        }), ...defaultPlugins]
      }
    })
  })

  //TODO: Renders default values, assert that the state ot the store is rendered

  it('should be possible to select one of the predefined inputs', async () => {
    const selectWrapper = wrapper.findComponent(VSelect) // Also possible to use the CSS selector .v-select
    expect(selectWrapper.exists()).toBe(true)
    selectWrapper.trigger('click')

    const select = selectWrapper.vm as VSelect
    const lastPredefinedInput = select.items[select.items.length - 1]

    //TODO: Selecting the value does not lead to updating the value here. Is it because pinia store is fully mocked? What happens to the store
    select.select(lastPredefinedInput)
    expect(lastPredefinedInput).to.equal('5:6 𝝅 0')

    await nextTick()

    let phaseXInput = wrapper.find('.v-text-field[data-test=phaseX] input')
    expect(phaseXInput.element.value).toBe('𝝅')
    let frequencyXInput = wrapper.find('.v-text-field[data-test=frequencyX] input')
    expect(frequencyXInput.element.value).toBe('50')
    let phaseYInput = wrapper.find('.v-text-field[data-test=phaseY] input')
    expect(phaseYInput.element.value).toBe('0')
    let frequencyYInput = wrapper.find('.v-text-field[data-test=frequencyY] input')
    expect(frequencyYInput.element.value).toBe('60')
    //TODO: Assert that the store has been changed
  });

  //TODO: When drawing is active Pause is enabled
  //TODO: When drawing is not active Draw is enabled
  //TODO: When drawing is paused both Draw and Resume are enabled
  //TODO: If some input is invalid, then Draw is disabled
  //TODO: Changing speed updates speed in the store
  //TODO: Changing inputs updates inputs in the store
});