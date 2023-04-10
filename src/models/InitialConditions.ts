export class FrequencyAndPhase {
  frequency: number;
  phase: number;
  constructor(frequency: number, phase: number) {
    this.frequency = frequency;
    this.phase = phase;
  }
  clone(): FrequencyAndPhase {
    return new FrequencyAndPhase(this.frequency, this.phase);
  }
}

export class InitialConditions {
  x: FrequencyAndPhase;
  y: FrequencyAndPhase;
  constructor(x: FrequencyAndPhase, y: FrequencyAndPhase) {
    this.x = x;
    this.y = y;
  }
  clone(): InitialConditions {
    return new InitialConditions(this.x.clone(), this.y.clone());
  };
  public toString(): string {
    return JSON.stringify(this, null, 2);
  }
}