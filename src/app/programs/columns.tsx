// src/app/programs/columns.tsx
import { ColumnDef } from "@tanstack/react-table"
import { programs } from "@/lib/schema"

export type Program = typeof programs.$inferSelect

export const columns: ColumnDef<Program>[] = [
        {
                accessorKey: "programTitle",
                header: "Program Title",
        },
        {
                accessorKey: "responsibleOrganization",
                header: "Organization",
        },
        {
                accessorKey: "programCountry",
                header: "Country",
        },
        {
                accessorKey: "ageMinimum",
                header: "Min Age",
        },
        {
                accessorKey: "ageMaximum",
                header: "Max Age",
        },
        {
                accessorKey: "employmentStatus",
                header: "Employment",
        },
        {
                accessorKey: "cashTransfer",
                header: "Cash Transfer",
                cell: ({ row }) => (
                        <span>{row.original.cashTransfer ? "Yes" : "No"}</span>
                ),
        },
        {
                accessorKey: "cashTransferMonthlyAmount",
                header: "Monthly Amount",
                cell: ({ row }) => {
                        const amount = row.original.cashTransferMonthlyAmount
                        if (!amount) return "-"
                        return new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                        }).format(amount)
                }
        },
        {
                accessorKey: "inKindTransfer",
                header: "In-Kind Transfer",
                cell: ({ row }) => (
                        <span>{row.original.inKindTransfer ? "Yes" : "No"}</span>
                ),
        },
]
