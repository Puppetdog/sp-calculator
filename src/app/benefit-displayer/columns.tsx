import { ColumnDef } from "@tanstack/react-table"
import type { ProgramSelect } from "@/lib/schema"

// Define the currency info types
type CurrencyInfo = {
        code: string;
        symbol: string;
        name: string;
}

type CurrencyMapping = {
        [K in "1" | "2" | "3" | "4" | "5"]: CurrencyInfo;
}

const currencyInfo: CurrencyMapping = {
        "1": { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" }, // Dominica
        "2": { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" }, // Grenada
        "3": { code: "JMD", symbol: "J$", name: "Jamaican Dollar" }, // Jamaica
        "4": { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" }, // Saint Lucia
        "5": { code: "TTD", symbol: "TT$", name: "Trinidad and Tobago Dollar" }, // Trinidad and Tobago
} as const;

// Define the type for the table data
export type TableData = {
        programTitle: string;
        responsibleOrganization: string;
        programDescription: string;
        cashTransferMonthly: number;
        inKindDollarValueAmt: number;
};

// Function to format currency with proper typing
export function formatCurrency(amount: number, countryCode: keyof typeof currencyInfo): string {
        const currency = currencyInfo[countryCode];
        return `${currency.symbol}${amount.toFixed(2)}`;
}

export const createColumns = (countryCode: keyof typeof currencyInfo): ColumnDef<TableData>[] => [
        {
                accessorKey: "programTitle",
                header: "Program Title",
        },
        {
                accessorKey: "responsibleOrganization",
                header: "Responsible Organization",
        },
        {
                accessorKey: "programDescription",
                header: "Description",
        },
        {
                accessorKey: "cashTransferMonthly",
                header: "Monthly Cash Transfer",
                cell: ({ row }) => {
                        const amount = row.original.cashTransferMonthly;
                        return formatCurrency(amount, countryCode);
                },
        },
        {
                accessorKey: "inKindDollarValueAmt",
                header: "Monthly In-Kind Value",
                cell: ({ row }) => {
                        const amount = row.original.inKindDollarValueAmt;
                        return formatCurrency(amount, countryCode);
                },
        },
];

// Helper function to convert ProgramSelect to TableData
export function programToTableData(program: ProgramSelect): TableData {
        return {
                programTitle: program.programTitle,
                responsibleOrganization: program.responsibleOrganization,
                programDescription: program.programDescription,
                cashTransferMonthly: program.cashTransferMonthlyAmount || 0,
                inKindDollarValueAmt: program.inKindDollarValueAmt || 0,
        };
}
