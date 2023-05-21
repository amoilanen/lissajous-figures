import { expect, it } from 'vitest'
import isEqual from 'lodash.isequal';

import { FrequencyAndPhase, RawFrequencyAndPhase, parsePhase } from '@/models/InitialConditions'

it('RawFrequencyAndPhase.parse should parse pi symbol', () => {
  expect(
    isEqual(
      new RawFrequencyAndPhase("10", "3𝝅/2").parse(),
      new FrequencyAndPhase(10, 3 * Math.PI / 2))
  ).to.be.true;
})

it('RawFrequencyAndPhase.parse should parse number input', () => {
  expect(
    isEqual(
      new RawFrequencyAndPhase("123.45", "3.45").parse(),
      new FrequencyAndPhase(123.45, 3.45))
  ).to.be.true;
})

it('parsePhase should parse only pi', () => {
  expect(parsePhase('𝝅')).to.equal(Math.PI)
})

it('parsePhase should parse only pi divided by a number', () => {
  expect(parsePhase('𝝅/2')).to.equal(Math.PI / 2)
  expect(parsePhase('𝝅 / 2')).to.equal(Math.PI / 2)
})

it('parsePhase should parse only pi multipled by a number', () => {
  expect(parsePhase('2𝝅')).to.equal(2 * Math.PI)
  expect(parsePhase('2 𝝅')).to.equal(2 * Math.PI)
  expect(parsePhase('2 * 𝝅')).to.equal(2 * Math.PI)
  expect(parsePhase('3𝝅/')).to.equal(3 * Math.PI)
})

it('parsePhase should parse pi multipled and divided by different numbers', () => {
  expect(parsePhase('3𝝅/2')).to.equal(3 * Math.PI / 2)
  expect(parsePhase('3𝝅 / 2')).to.equal(3 * Math.PI / 2)
  expect(parsePhase('3 * 𝝅 / 2')).to.equal(3 * Math.PI / 2)
})

it('parsePhase should parse pi multipled and divided by different numbers with different signs', () => {
  expect(parsePhase('-3𝝅/2')).to.equal(-3 * Math.PI / 2)
  expect(parsePhase('3𝝅/-2')).to.equal(-3 * Math.PI / 2)
})

it('parsePhase should parse a valid expression not containing pi', () => {
  expect(parsePhase('123.45')).to.equal(123.45)
})

it('parsePhase should parse an invalid expression as NaN', () => {
  expect(parsePhase('abc')).to.be.NaN
})