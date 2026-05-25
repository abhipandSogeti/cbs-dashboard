const columns = [
    {
        accessorKey: 'Perioden',
        header: 'Period',
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: 'RegioS',
        header: 'Region',
        cell: (info) => info.getValue().trim(),
    },
    {
        accessorKey: 'BevolkingAanHetBeginVanDePeriode_1',
        header: 'Population',
        cell: (info) => {
            const val = info.getValue();
            return val !== null ? val.toLocaleString('nl-NL') : '-';
        },
    },
    {
        accessorKey: 'TotaleBevolkingsgroei_4',
        header: 'Growth',
        cell: (info) => {
            const val = info.getValue();
            return val !== null ? val.toLocaleString('nl-NL') : '-';
        },
    },
];
export const populationConfig = {
    datasetId: '83765NED',
    columns,
};
