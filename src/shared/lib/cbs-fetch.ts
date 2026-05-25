// src/shared/lib/cbs-fetch.ts
import { z } from 'zod'
import type { CbsParams, CbsResponse } from '@/shared/types/api'
import { cbsRawResponseSchema } from '@/shared/types/api'

const CBS_BASE = 'https://opendata.cbs.nl/ODataApi/odata'

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

  return {
    total: parsed.data['odata.count'],
    rows: parsed.data.value,
  }
}
