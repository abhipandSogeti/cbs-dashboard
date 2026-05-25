// src/shared/lib/cbs-fetch.ts
import { z } from 'zod'
import type { CbsParams, CbsResponse } from '@/shared/types/api'
import { cbsRawResponseSchema } from '@/shared/types/api'

const CBS_BASE = 'https://opendata.cbs.nl/ODataFeed/odata'

export const buildUrl = ({ datasetId, top, skip, orderBy, filter }: CbsParams): string => {
  const params = new URLSearchParams({
    '$format': 'json',
    '$top': String(top),
    '$skip': String(skip),
    ...(orderBy !== undefined && { '$orderby': orderBy }),
    ...(filter !== undefined && { '$filter': filter }),
  })
  return `${CBS_BASE}/${datasetId}/TypedDataSet?${params}`
}

export const fetchCbsDataset = async <T>(
  params: CbsParams,
  itemSchema: z.ZodSchema<T>
): Promise<CbsResponse<T>> => {
  const res = await fetch(buildUrl(params))

  if (!res.ok) {
    throw new Error(`CBS API error ${res.status} for dataset ${params.datasetId}`)
  }

  const json: unknown = await res.json()
  const schema = cbsRawResponseSchema(itemSchema)
  const parsed = schema.safeParse(json)

  if (!parsed.success) {
    throw new Error(`Unexpected CBS response shape: ${parsed.error.message}`)
  }

  return { total: 0, rows: parsed.data.value }
}

export const fetchCbsCount = async (datasetId: string): Promise<number> => {
  const res = await fetch(`${CBS_BASE}/${datasetId}/TypedDataSet/$count`)
  if (!res.ok) throw new Error(`CBS count error ${res.status} for ${datasetId}`)
  const text = await res.text()
  const count = parseInt(text.trim(), 10)
  return isNaN(count) ? 0 : count
}
