// src/features/dashboard/types/schemas.test.ts
import { describe, it, expect } from 'vitest'
import { PopulationRowSchema } from './population.schema'
import { LabourRowSchema } from './labour.schema'
import { EconomyRowSchema } from './economy.schema'
import { EnergyRowSchema } from './energy.schema'

describe('PopulationRowSchema', () => {
  it('parses a valid population row', () => {
    const result = PopulationRowSchema.safeParse({
      ID: 0,
      Perioden: '2023JJ00',
      TotaleBevolking_1: 17890000,
      Mannen_2: 8900000,
      Vrouwen_3: 8990000,
      TotaleBevolkingsgroei_67: 82000,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a row missing required Perioden', () => {
    const result = PopulationRowSchema.safeParse({ ID: 0 })
    expect(result.success).toBe(false)
  })
})

describe('LabourRowSchema', () => {
  it('parses a valid labour row', () => {
    const result = LabourRowSchema.safeParse({
      ID: 0,
      Geslacht: 'T001038',
      Leeftijd: '10000',
      Perioden: '2023KW01',
      NietSeizoengecorrigeerd_1: 8800,
      Seizoengecorrigeerd_2: 8850,
    })
    expect(result.success).toBe(true)
  })

  it('accepts null for nullable fields', () => {
    const result = LabourRowSchema.safeParse({
      ID: 0,
      Geslacht: 'T001038',
      Leeftijd: '10000',
      Perioden: '2023KW01',
      NietSeizoengecorrigeerd_1: null,
      Seizoengecorrigeerd_2: null,
    })
    expect(result.success).toBe(true)
  })
})

describe('EconomyRowSchema', () => {
  it('parses a valid economy row', () => {
    const result = EconomyRowSchema.safeParse({
      ID: 0,
      GoederenEnDiensten: 'T001081',
      Perioden: '2023JJ00',
      Volumemutaties_1: 2.1,
      Indexcijfers2000100_3: 115.4,
    })
    expect(result.success).toBe(true)
  })
})

describe('EnergyRowSchema', () => {
  it('parses a valid energy row', () => {
    const result = EnergyRowSchema.safeParse({
      ID: 0,
      Energiedragers: 'T001027',
      Perioden: '2022JJ00',
      TotaalAanbodTPES_1: 2841,
      NettoInvoer_5: 1512,
    })
    expect(result.success).toBe(true)
  })
})
