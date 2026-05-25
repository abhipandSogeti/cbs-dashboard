// src/shared/types/api.ts
import { z } from 'zod'

export type CbsParams = {
  datasetId: string
  top: number
  skip: number
  orderBy?: string
  filter?: string
}

export type CbsResponse<T> = {
  total: number
  rows: T[]
}

export const cbsRawResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    value: z.array(itemSchema),
  })

export type ApiError = {
  status: number
  message: string
}
