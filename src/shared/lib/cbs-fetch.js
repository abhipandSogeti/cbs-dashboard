import { cbsRawResponseSchema } from '@/shared/types/api';
const CBS_BASE = 'https://opendata.cbs.nl/ODataApi/odata';
export const buildUrl = ({ datasetId, top, skip, orderBy, filter }) => {
    const params = new URLSearchParams({
        '$format': 'json',
        '$top': String(top),
        '$skip': String(skip),
        ...(orderBy !== undefined && { '$orderby': orderBy }),
        ...(filter !== undefined && { '$filter': filter }),
    });
    return `${CBS_BASE}/${datasetId}/TypedDataSet?${params}`;
};
export const fetchCbsDataset = async (params, itemSchema) => {
    const res = await fetch(buildUrl(params));
    if (!res.ok) {
        throw new Error(`CBS API error ${res.status} for dataset ${params.datasetId}`);
    }
    const json = await res.json();
    const schema = cbsRawResponseSchema(itemSchema);
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
        throw new Error(`Unexpected CBS response shape: ${parsed.error.message}`);
    }
    return {
        total: parsed.data['odata.count'],
        rows: parsed.data.value,
    };
};
