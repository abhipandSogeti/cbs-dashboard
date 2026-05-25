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
      RegioS: 'NL01  ',
      BevolkingAanHetBeginVanDePeriode_1: 17890000,
      TotaleBevolkingsgroei_4: 120000,
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
      Perioden: '2023JJ00',
      Geslacht: 'T001038',
      Arbeidsdeelname_1: 72.4,
    })
    expect(result.success).toBe(true)
  })

  it('accepts null for nullable labour field', () => {
    const result = LabourRowSchema.safeParse({
      ID: 0,
      Perioden: '2023JJ00',
      Geslacht: 'T001038',
      Arbeidsdeelname_1: null,
    })
    expect(result.success).toBe(true)
  })
})

describe('EconomyRowSchema', () => {
  it('parses a valid economy row', () => {
    const result = EconomyRowSchema.safeParse({
      ID: 0,
      Perioden: '2023JJ00',
      BrutoProductie_1: 1200000,
      ToegegevoedeWaarde_2: 800000,
    })
    expect(result.success).toBe(true)
  })
})

describe('EnergyRowSchema', () => {
  it('parses a valid energy row', () => {
    const result = EnergyRowSchema.safeParse({
      ID: 0,
      Perioden: '2022JJ00',
      EnergiedragerSoorten: 'A049649',
      TotaalBinnenlandsBrutoVerbruik_1: 3200,
    })
    expect(result.success).toBe(true)
  })
})
