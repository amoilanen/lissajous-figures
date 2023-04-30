import { expect, it } from 'vitest'
import { gcd } from '@/math/GreatestCommonDivisor';

it('gcd', () => {
  expect(gcd(8, 6)).toBe(2)
  expect(gcd(13, 27)).toBe(1)
  expect(gcd(16, 256)).toBe(16)
})