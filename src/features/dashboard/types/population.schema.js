import { z } from 'zod';
export const PopulationRowSchema = z.object({
    ID: z.number(),
    Perioden: z.string(),
    RegioS: z.string(),
    BevolkingAanHetBeginVanDePeriode_1: z.number().nullable(),
    TotaleBevolkingsgroei_4: z.number().nullable(),
});
