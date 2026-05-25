import { http, HttpResponse } from 'msw'

const CBS_BASE = 'https://opendata.cbs.nl/ODataApi/odata'

export const mockPopulationResponse = {
  'odata.count': '1000',
  value: Array.from({ length: 20 }, (_, i) => ({
    ID: i,
    Perioden: `${2000 + i}JJ00`,
    RegioS: 'NL01  ',
    BevolkingAanHetBeginVanDePeriode_1: 17000000 + i * 1000,
    TotaleBevolkingsgroei_4: 100000 + i * 500,
  })),
}

export const mockLabourResponse = {
  'odata.count': '500',
  value: Array.from({ length: 20 }, (_, i) => ({
    ID: i,
    Perioden: `${2000 + i}JJ00`,
    Geslacht: 'T001038',
    Arbeidsdeelname_1: 70 + i * 0.2,
  })),
}

export const mockEconomyResponse = {
  'odata.count': '200',
  value: Array.from({ length: 20 }, (_, i) => ({
    ID: i,
    Perioden: `${2000 + i}JJ00`,
    BrutoProductie_1: 1200000 + i * 1000,
    ToegegevoedeWaarde_2: 800000 + i * 500,
  })),
}

export const mockEnergyResponse = {
  'odata.count': '300',
  value: Array.from({ length: 20 }, (_, i) => ({
    ID: i,
    Perioden: `${2000 + i}JJ00`,
    EnergiedragerSoorten: 'A049649',
    TotaalBinnenlandsBrutoVerbruik_1: 3000 + i * 10,
  })),
}

export const handlers = [
  http.get(`${CBS_BASE}/83765NED/TypedDataSet`, () =>
    HttpResponse.json(mockPopulationResponse)
  ),
  http.get(`${CBS_BASE}/85039NED/TypedDataSet`, () =>
    HttpResponse.json(mockLabourResponse)
  ),
  http.get(`${CBS_BASE}/84410NED/TypedDataSet`, () =>
    HttpResponse.json(mockEconomyResponse)
  ),
  http.get(`${CBS_BASE}/83140ned/TypedDataSet`, () =>
    HttpResponse.json(mockEnergyResponse)
  ),
]
