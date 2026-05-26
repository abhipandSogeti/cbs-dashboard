import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { CountrySchema } from "../types/country.schema";

const FIELDS =
  "cca3,name,population,area,subregion,region,borders,flag,capital";

export const useCountriesByRegion = (region: string) =>
  useQuery({
    queryKey: ["countries", region] as const,
    queryFn: async () => {
      const res = await fetch(
        `https://restcountries.com/v3.1/region/${region}?fields=${FIELDS}`,
      );
      if (!res.ok) throw new Error(`Countries API ${res.status}`);
      const json: unknown = await res.json();
      return z.array(CountrySchema).parse(json);
    },
    staleTime: 24 * 60 * 60_000,
  });

export const useAllCountries = () =>
  useQuery({
    queryKey: ["countries", "all"] as const,
    queryFn: async () => {
      const res = await fetch(
        `https://restcountries.com/v3.1/all?fields=${FIELDS}`,
      );
      if (!res.ok) throw new Error(`Countries API ${res.status}`);
      const json: unknown = await res.json();
      return z.array(CountrySchema).parse(json);
    },
    staleTime: 24 * 60 * 60_000,
  });

export const formatPop = (n: number): string => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toLocaleString();
};
