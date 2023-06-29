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
  // Parsing the expression of the form times * 𝝅 / dividedBy
  let match = input.match(/(\-?\d)?\s*\*?\s*𝝅\s*(\/?\s*(\-?\d+))?/)
  if (match) {
    let times = 1
    if (match[1])
      times = parseInt(match[1])
    let dividedBy = 1
    if (match[3])
      dividedBy = parseInt(match[3])
    return times * Math.PI / dividedBy
  } else {
    return parseFloat(input)
  }
}

export class FrequencyAndPhaseInput {
  frequency: string;
  phase: string;
  constructor(frequency: string, phase: string) {
    this.frequency = frequency;
    this.phase = phase;
  }
  parse(): FrequencyAndPhase {
    return new FrequencyAndPhase(parseFloat(this.frequency), parsePhase(this.phase))
  }
  clone(): FrequencyAndPhaseInput {
    return new FrequencyAndPhaseInput(this.frequency, this.phase);
  }
}

export class InitialConditionsInput {
  x: FrequencyAndPhaseInput;
  y: FrequencyAndPhaseInput;
  constructor(x: FrequencyAndPhaseInput, y: FrequencyAndPhaseInput) {
    this.x = x;
    this.y = y;
  }
  parse(): InitialConditions {
    return new InitialConditions(this.x.parse(), this.y.parse());
  };
  clone(): InitialConditionsInput {
    return new InitialConditionsInput(this.x.clone(), this.y.clone());
  };
  public toString(): string {
    return JSON.stringify(this, null, 2);
  }
}