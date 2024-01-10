import { describe, expect, it, beforeAll } from 'vitest'

import { initPlugins } from '@/plugins'

import Explanation from '@/components/Explanation.vue'
import { mount, config, VueWrapper } from '@vue/test-utils'

config.global.plugins = initPlugins()

describe('Explanation', () => {

  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = mount(Explanation)
  })

  it('should display the title', () => {
    expect(wrapper.find('.v-card-title').text()).toEqual('Background Physics and Mathematics')
  });

  it('should display the explanation', () => {
    expect(wrapper.text()).toContain('Lissajous curve is a trajectory')
  });
});