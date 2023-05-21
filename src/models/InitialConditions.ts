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

export class RawFrequencyAndPhase {
  frequency: string;
  phase: string;
  constructor(frequency: string, phase: string) {
    this.frequency = frequency;
    this.phase = phase;
  }
  //TODO: Implement and add tests
  parse(): FrequencyAndPhase {
    return new FrequencyAndPhase(parseFloat(this.frequency), parseFloat(this.phase))
  }
}

export class RawInitialConditions {
  x: RawFrequencyAndPhase;
  y: RawFrequencyAndPhase;
  constructor(x: RawFrequencyAndPhase, y: RawFrequencyAndPhase) {
    this.x = x;
    this.y = y;
  }
  parse(): InitialConditions {
    return new InitialConditions(this.x.parse(), this.y.parse());
  };
  public toString(): string {
    return JSON.stringify(this, null, 2);
  }
}