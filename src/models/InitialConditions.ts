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
  public toString(): string {
    return JSON.stringify(this, null, 2);
  }
}

export function parsePhase(input: string): number {
  // Parsing the expression of the form a * 𝝅 / b
  let match = input.match(/(\-?\d)?\s*\*?\s*𝝅\s*(\/?\s*(\-?\d+))?/)
  if (match) {
    let a = 1
    if (match[1])
      a = parseInt(match[1])
    let b = 1
    if (match[3])
      b = parseInt(match[3])
    return a * Math.PI / b
  } else {
    return parseFloat(input)
  }
}

export class RawFrequencyAndPhase {
  frequency: string;
  phase: string;
  constructor(frequency: string, phase: string) {
    this.frequency = frequency;
    this.phase = phase;
  }
  parse(): FrequencyAndPhase {
    return new FrequencyAndPhase(parseFloat(this.frequency), parsePhase(this.phase))
  }
  clone(): RawFrequencyAndPhase {
    return new RawFrequencyAndPhase(this.frequency, this.phase);
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
  clone(): RawInitialConditions {
    return new RawInitialConditions(this.x.clone(), this.y.clone());
  };
  public toString(): string {
    return JSON.stringify(this, null, 2);
  }
}