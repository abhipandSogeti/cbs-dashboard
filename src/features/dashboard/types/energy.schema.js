import { z } from 'zod';
export const EnergyRowSchema = z.object({
    ID: z.number(),
    Energiedragers: z.string(),
    Perioden: z.string(),
    TotaalAanbodTPES_1: z.number().nullable(),
    NettoInvoer_5: z.number().nullable(),
});
