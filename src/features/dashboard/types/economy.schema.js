import { z } from 'zod';
export const EconomyRowSchema = z.object({
    ID: z.number(),
    GoederenEnDiensten: z.string(),
    Perioden: z.string(),
    Volumemutaties_1: z.number().nullable(),
    Indexcijfers2000100_3: z.number().nullable(),
});
