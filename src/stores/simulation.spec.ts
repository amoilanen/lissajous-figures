import { describe, expect, it, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { InitialConditions, InitialConditionsInput, FrequencyAndPhaseInput, FrequencyAndPhase } from '@/models/InitialConditions'

import { useSimulationStore, DrawingState } from '@/stores/simulation'

describe("simulation store", () => {

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("should have default state 'Initial', no active visualization id", () => {
    const store = useSimulationStore()
    expect(store.drawingState).toBe(DrawingState.Initial)
    expect(store.activeVisualization).to.be.null
  })

  it("should update conditions and record active visualization id on startDrawing", () => {
    const store = useSimulationStore()
    store.$patch({
      conditionsInput:  new InitialConditionsInput(
        new FrequencyAndPhaseInput("2", "4"),
        new FrequencyAndPhaseInput("3", "5")
      )
    })
    store.startDrawing()
    expect(store.activeVisualization).to.not.be.null
    expect(store.conditions).toEqual(new InitialConditions(
      new FrequencyAndPhase(2, 4),
      new FrequencyAndPhase(3, 5)
    ))
    expect(store.drawingState).toBe(DrawingState.Started)
  })
})