const columns = [
    {
        accessorKey: 'Perioden',
        header: 'Period',
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: 'Geslacht',
        header: 'Gender',
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: 'Arbeidsdeelname_1',
        header: 'Participation %',
        cell: (info) => {
            const val = info.getValue();
            return val !== null ? `${val.toFixed(1)}%` : '-';
        },
    },
];
export const labourConfig = {
    datasetId: '85039NED',
    columns,
};
