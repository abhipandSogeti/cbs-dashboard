import { z } from 'zod';
export const cbsRawResponseSchema = (itemSchema) =>
    z.object({
        value: z.array(itemSchema),
    });
