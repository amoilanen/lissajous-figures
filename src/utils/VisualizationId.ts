const MAX_VISUALIZATION_ID = 1000

export type VisualizationId = Number

export function createRandomVisualizationId(): VisualizationId {
  return Math.floor(Math.random() * MAX_VISUALIZATION_ID)
}