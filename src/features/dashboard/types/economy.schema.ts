import { z } from 'zod'

export const EconomyRowSchema = z.object({
  ID: z.number(),
  Perioden: z.string(),
  BrutoProductie_1: z.number().nullable(),
  ToegegevoedeWaarde_2: z.number().nullable(),
})

export type EconomyRow = z.infer<typeof EconomyRowSchema>
