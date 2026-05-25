import { z } from 'zod';
export const EnergyRowSchema = z.object({
    ID: z.number(),
    Perioden: z.string(),
    EnergiedragerSoorten: z.string(),
    TotaalBinnenlandsBrutoVerbruik_1: z.number().nullable(),
});
