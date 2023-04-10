export class FrequencyAndPhase {
  frequency: number;
  phase: number;
  constructor(frequency: number, phase: number) {
    this.frequency = frequency;
    this.phase = phase;
  }
}

export class InitialConditions {
  x: FrequencyAndPhase;
  y: FrequencyAndPhase;
  constructor(x: FrequencyAndPhase, y: FrequencyAndPhase) {
    this.x = x;
    this.y = y;
  }
}