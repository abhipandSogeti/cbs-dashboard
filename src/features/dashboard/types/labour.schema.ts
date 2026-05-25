import { z } from 'zod'

export const LabourRowSchema = z.object({
  ID: z.number(),
  Perioden: z.string(),
  Geslacht: z.string(),
  Arbeidsdeelname_1: z.number().nullable(),
})

export type LabourRow = z.infer<typeof LabourRowSchema>
