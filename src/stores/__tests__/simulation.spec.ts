import { describe, expect, it, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { InitialConditions, InitialConditionsInput, FrequencyAndPhaseInput, FrequencyAndPhase } from '@/models/InitialConditions'

import { useSimulationStore, DrawingState, defaultInitialConditionsInput } from '@/stores/simulation'

describe("simulation store", () => {

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("should have default state 'Initial', no active visualization id", () => {
    const store = useSimulationStore()
    expect(store.drawingState).toBe(DrawingState.Initial)
    expect(store.activeVisualization).to.be.null
    expect(store.isDrawing).to.be.false
    expect(store.conditionsInput).toEqual(defaultInitialConditionsInput)
    expect(store.conditions).to.be.null
    expect(store.timeSpeed).toEqual(1)
  })

  // start
  it("startDrawing: should update conditions and record active visualization id", async () => {
    const store = useSimulationStore()
    const conditionsInput = new InitialConditionsInput(
      new FrequencyAndPhaseInput("2", "4"),
      new FrequencyAndPhaseInput("3", "5")
    )
    await store.$patch({
      conditionsInput
    })
    await store.startDrawing()
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

  // start -> pause
  it("pauseDrawing: should keep conditions, update state", async () => {
    const store = useSimulationStore()
    await store.startDrawing()
    store.pauseDrawing()
    expect(store.drawingState).toBe(DrawingState.Paused)
    expect(store.isDrawing).to.be.false
    expect(store.activeVisualization).to.not.be.null
    expect(store.conditionsInput).toEqual(defaultInitialConditionsInput)
    expect(store.conditions).toEqual(defaultInitialConditionsInput.parse())
    expect(store.timeSpeed).toEqual(1)
  })

  // start -> pause -> resume
  it("resumeDrawing: should keep conditions, update state", async () => {
    const store = useSimulationStore()
    await store.startDrawing()
    store.pauseDrawing()
    store.resumeDrawing()
    expect(store.drawingState).toBe(DrawingState.Resumed)
    expect(store.isDrawing).to.be.true
    expect(store.activeVisualization).to.not.be.null
    expect(store.conditionsInput).toEqual(defaultInitialConditionsInput)
    expect(store.conditions).toEqual(defaultInitialConditionsInput.parse())
    expect(store.timeSpeed).toEqual(1)
  })

  // start -> finish
  it("markDrawingAsFinished: reset active visualization id, updates state", async () => {
    const store = useSimulationStore()
    await store.startDrawing()
    store.markDrawingAsFinished()
    expect(store.drawingState).toBe(DrawingState.Finished)
    expect(store.isDrawing).to.be.false
    expect(store.activeVisualization).to.be.null
    expect(store.conditionsInput).toEqual(defaultInitialConditionsInput)
    expect(store.conditions).toEqual(defaultInitialConditionsInput.parse())
    expect(store.timeSpeed).toEqual(1)
  })

  // start -> reset
  it("resetDrawing: reset active visualization id, updates state", async () => {
    const store = useSimulationStore()
    await store.startDrawing()
    store.resetDrawing()
    expect(store.drawingState).toBe(DrawingState.Initial)
    expect(store.isDrawing).to.be.false
    expect(store.activeVisualization).to.be.null
    expect(store.conditionsInput).toEqual(defaultInitialConditionsInput)
    expect(store.conditions).toEqual(defaultInitialConditionsInput.parse())
    expect(store.timeSpeed).toEqual(1)
  })

  //TODO: Resume drawing, pausing drawing again, resuming again
  //TODO: Starting drawing again when the drawing has been started and is ongoing
  //TODO: Staring drawing again when the drawing has been paused
  //TODO: Start drawing after the drawing has been finished
  //TODO: Resetting drawing when the drawing has been started and is ongoing
  //TODO: Resetting drawing after it has been paused
  //TODO: Resetting drawing after it has been finished

  //~TODO: Not possible to startDrawing twice in a row~
  //TODO: Not possible to stopDrawing twice in a row
  //TODO: Not possible to resumeDrawing twice in a row

  //TODO: Not possible to resumeDrawing after the drawing has finished
  //TODO: Not possible to pauseDrawing after the drawing has finished
  //TODO: Not possible to markDrawingAsFinished after the drawing has finished

  //~TODO: Not possible to startDrawing after the drawing has been stopped~
  //TODO: Not possible to markDrawingAsFinished after the drawing has been stopped
})