import { describe, expect, it, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useSimulationStore, DrawingState } from '@/stores/simulation'

describe("simulation store", () => {

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("should have default state 'Initial'", () => {
    const store = useSimulationStore()
    expect(store.drawingState).toBe(DrawingState.Initial)
  })
})