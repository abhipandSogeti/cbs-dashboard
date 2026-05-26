// tests/msw/handlers.ts
import { http, HttpResponse } from 'msw';
const CBS_BASE = 'https://opendata.cbs.nl/ODataFeed/odata';
export const mockPopulationResponse = {
    value: Array.from({ length: 20 }, (_, i) => ({
        ID: i,
        Perioden: `${2000 + i}JJ00`,
        TotaleBevolking_1: 17000000 + i * 10000,
        Mannen_2: 8500000 + i * 5000,
        Vrouwen_3: 8500000 + i * 5000,
        TotaleBevolkingsgroei_67: 80000 + i * 1000,
    })),
};
export const mockLabourResponse = {
    value: Array.from({ length: 20 }, (_, i) => ({
        ID: i,
        Geslacht: 'T001038',
        Leeftijd: '10000',
        Perioden: `${2000 + i}KW01`,
        NietSeizoengecorrigeerd_1: 8800 + i * 10,
        Seizoengecorrigeerd_2: 8850 + i * 10,
    })),
};
export const mockEconomyResponse = {
    value: Array.from({ length: 20 }, (_, i) => ({
        ID: i,
        GoederenEnDiensten: 'T001081',
        Perioden: `${2000 + i}JJ00`,
        Volumemutaties_1: 2.1 + i * 0.1,
        Indexcijfers2000100_3: 100 + i * 3,
    })),
};
export const mockEnergyResponse = {
    value: Array.from({ length: 20 }, (_, i) => ({
        ID: i,
        Energiedragers: 'T001027',
        Perioden: `${2000 + i}JJ00`,
        TotaalAanbodTPES_1: 2800 + i * 10,
        NettoInvoer_5: 1400 + i * 5,
    })),
};
const countCounts = {
    '37296ned': '1000',
    '80590ned': '500',
    '70076ned': '200',
    '83140ned': '300',
};
export const handlers = [
    // Count endpoints — must be before data endpoints so the more-specific path wins
    http.get(/\/ODataFeed\/odata\/([^/]+)\/TypedDataSet\/\$count/, ({ request }) => {
        const url = new URL(request.url);
        const match = url.pathname.match(/\/([^/]+)\/TypedDataSet\/\$count$/);
        const datasetId = match?.[1] ?? '';
        return HttpResponse.text(countCounts[datasetId] ?? '0');
    }),
    // Data endpoints
    http.get(`${CBS_BASE}/37296ned/TypedDataSet`, () => HttpResponse.json(mockPopulationResponse)),
    http.get(`${CBS_BASE}/80590ned/TypedDataSet`, () => HttpResponse.json(mockLabourResponse)),
    http.get(`${CBS_BASE}/70076ned/TypedDataSet`, () => HttpResponse.json(mockEconomyResponse)),
    http.get(`${CBS_BASE}/83140ned/TypedDataSet`, () => HttpResponse.json(mockEnergyResponse)),
];
