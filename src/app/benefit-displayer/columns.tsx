import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"

// Currency information for each country
const currencyInfo = {
        "1": { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" }, // Dominica
        "2": { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" }, // Grenada
        "3": { code: "JMD", symbol: "J$", name: "Jamaican Dollar" }, // Jamaica
        "4": { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" }, // Saint Lucia
        "5": { code: "TTD", symbol: "TT$", name: "Trinidad and Tobago Dollar" }, // Trinidad and Tobago
};

// Define the enums
const typeofDependentsEnum = ["1", "2", "3", "4"] as const;
const employmentStatusEnum = ["1", "2", "3", "4", "5"] as const;
const disabilityStatusEnum = ["1", "2", "3", "4"] as const;
const chronicIllnessStatusEnum = ["1", "2", "3", "4"] as const;
const sameCountryEnum = ["1", "2", "3"] as const;
const countryEnum = ["1", "2", "3", "4", "5"] as const;
const genderEnum = ["1", "2", "3", "4"] as const;

export const socialProtectionProgramSchema = z.object({
        programTitle: z.string().min(4),
        responsibleOrganization: z.string().min(4),
        programDescription: z.string().min(4),
        duration: z.number().min(1).max(100),
        ageMinimum: z.number().min(1).max(30),
        ageMaximum: z.number().min(30).max(120),
        gender: z.enum(genderEnum),
        numberOfDependents: z.number().min(0).max(5),
        typeOfDependents: z.enum(typeofDependentsEnum),
        employmentStatus: z.enum(employmentStatusEnum),
        disabilityStatus: z.enum(disabilityStatusEnum),
        chronicIllnessStatus: z.enum(chronicIllnessStatusEnum),
        householdSize: z.number().min(1).max(15),
        countryOfOrigin: z.enum(sameCountryEnum),
        countryOfResidence: z.enum(countryEnum),
        preRequisitePrograms: z.optional(z.array(z.string())),
        cashTransferMonthly: z.number().min(0).max(1500),
        inKindDollarValueAmt: z.number().min(0).max(1500)
});

export type SocialProtectionProgram = z.infer<typeof socialProtectionProgramSchema>;

// Define the type for the table data
export type TableData = {
        programTitle: string;
        responsibleOrganization: string;
        programDescription: string;
        cashTransferMonthly: number;
        inKindDollarValueAmt: number;
};

// Function to format currency
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
