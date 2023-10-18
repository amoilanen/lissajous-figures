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
    expect(store.isDrawing).to.be.false
    expect(store.conditionsInput).toEqual(store.defaultInitialConditionsInput)
    expect(store.conditions).to.be.null
    expect(store.timeSpeed).toEqual(1)
  })

  it("should update conditions and record active visualization id on startDrawing", () => {
    const store = useSimulationStore()
    const conditionsInput = new InitialConditionsInput(
      new FrequencyAndPhaseInput("2", "4"),
      new FrequencyAndPhaseInput("3", "5")
    )
    store.$patch({
      conditionsInput
    })
    store.startDrawing()
    expect(store.drawingState).toBe(DrawingState.Started)
    expect(store.isDrawing).to.be.true
    expect(store.activeVisualization).to.not.be.null
    expect(store.conditionsInput).toEqual(conditionsInput)
    expect(store.conditions).toEqual(new InitialConditions(
      new FrequencyAndPhase(2, 4),
      new FrequencyAndPhase(3, 5)
    ))
    expect(store.timeSpeed).toEqual(1)
  })

  //TODO: Other methods tested in isolation

  it("should be possible to start and finish drawing", () => {
    const store = useSimulationStore()
    store.startDrawing()
    store.markDrawingAsFinished()
    expect(store.drawingState).toBe(DrawingState.Finished)
    expect(store.isDrawing).to.be.false
    expect(store.activeVisualization).to.be.null
    expect(store.conditionsInput).toEqual(store.defaultInitialConditionsInput)
    expect(store.conditions).toEqual(store.defaultInitialConditionsInput.parse())
    expect(store.timeSpeed).toEqual(1)
  })

  //TODO: Resume drawing after it has been stopped
  //TODO: Resume drawing, stopping drawing again, resuming again
  //TODO: Start drawing after the drawing has been finished

  //TODO: Not possible to startDrawing twice in a row
  //TODO: Not possible to stopDrawing twice in a row
  //TODO: Not possible to resumeDrawing twice in a row

  //TODO: Not possible to resumeDrawing after the drawing has finished
  //TODO: Not possible to stopDrawing after the drawing has finished
  //TODO: Not possible to markDrawingAsFinished after the drawing has finished

  //TODO: Not possible to startDrawing after the drawing has been stopped
  //TODO: Not possible to markDrawingAsFinished after the drawing has been stopped
})