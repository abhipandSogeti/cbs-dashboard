import { z } from "zod";

export const CountrySchema = z.object({
  cca3: z.string(),
  name: z.object({ common: z.string() }),
  population: z.number(),
  area: z.number().optional(),
  subregion: z.string().optional().default(""),
  region: z.string(),
  borders: z.array(z.string()).optional().default([]),
});

export type Country = z.infer<typeof CountrySchema>;
