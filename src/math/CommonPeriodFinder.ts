import { gcd } from '@/math/GreatestCommonDivisor';

function isInteger(x: number): boolean {
  return Math.floor(x) == x;
}

//TODO: Test
/*
 * Optimization to find the minimal period to draw the figure for the math
 * See [finding_common_period.jpg](../../docs/finding_common_period.jpg)
 */
export function findCommonPeriod(frequencyOne: number, frequencyTwo: number): number | undefined {
  if (isInteger(frequencyOne) && isInteger(frequencyTwo)) {
    let periodOne = (2 * Math.PI) / frequencyOne
    let frequencyGcd = gcd(frequencyOne, frequencyTwo)
    let periodXTimes = frequencyOne / frequencyGcd
    return periodXTimes * periodOne
  }
}