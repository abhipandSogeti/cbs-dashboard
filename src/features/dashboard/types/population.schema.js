import { z } from 'zod';
export const PopulationRowSchema = z.object({
    ID: z.number(),
    Perioden: z.string(),
    TotaleBevolking_1: z.number().nullable(),
    Mannen_2: z.number().nullable(),
    Vrouwen_3: z.number().nullable(),
    TotaleBevolkingsgroei_67: z.number().nullable(),
});
