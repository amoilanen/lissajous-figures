import { expect, it } from 'vitest'
import { findCommonPeriod } from '@/math/CommonPeriodFinder'

it('findCommonPeriod for integer frequencies', () => {
  expect(findCommonPeriod(16, 20)).toBe(Math.PI / 2)
  expect(findCommonPeriod(4, 20)).toBe(Math.PI / 2)
  expect(findCommonPeriod(5, 6)).toBe(2 * Math.PI)
  expect(findCommonPeriod(15, 9)).toBe(2 * Math.PI / 3)
})

it('findCommonPeriod for non-integer frequencies', () => {
  expect(findCommonPeriod(0.1, 0.2)).toBeUndefined
})