import { describe, expect, it, beforeEach } from 'vitest'

import Explanation from '@/components/Explanation.vue'

import { mount } from '@vue/test-utils'

describe('Explanation', () => {
  it('should display the explanation', () => {
    const wrapper = mount(Explanation)
    expect(wrapper.text()).toContain('Lissajous curve is a trajectory')
  });
});