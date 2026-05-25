import { z } from 'zod';
export const LabourRowSchema = z.object({
    ID: z.number(),
    Geslacht: z.string(),
    Leeftijd: z.string(),
    Perioden: z.string(),
    NietSeizoengecorrigeerd_1: z.number().nullable(),
    Seizoengecorrigeerd_2: z.number().nullable(),
});
