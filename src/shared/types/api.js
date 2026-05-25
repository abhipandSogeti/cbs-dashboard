// src/shared/types/api.ts
import { z } from 'zod';
export const cbsRawResponseSchema = (itemSchema) => z.object({
    'odata.count': z.string().transform(Number),
    value: z.array(itemSchema),
});
