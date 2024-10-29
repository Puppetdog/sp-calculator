// src/app/programs/page.tsx
"use client"

import {
        ColumnDef,
        flexRender,
        getCoreRowModel,
        useReactTable,
} from "@tanstack/react-table"

import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { listPrograms } from "@/lib/actions"
import { programs } from "@/lib/schema"

type Program = typeof programs.$inferSelect

const columns: ColumnDef<Program>[] = [
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

export default function ProgramsPage() {
        const [programs, setPrograms] = useState<Program[]>([])
        const [loading, setLoading] = useState(true)

        useEffect(() => {
                const fetchPrograms = async () => {
                        try {
                                const data = await listPrograms()
                                setPrograms(data)
                        } catch (error) {
                                console.error('Error fetching programs:', error)
                        } finally {
                                setLoading(false)
                        }
                }

                fetchPrograms()
        }, [])

        const table = useReactTable({
                data: programs,
                columns,
                getCoreRowModel: getCoreRowModel(),
        })

        if (loading) {
                return (
                        <div className="container mx-auto py-10">
                                <Card>
                                        <CardContent className="p-6">
                                                <div className="flex items-center justify-center h-32">
                                                        <p className="text-muted-foreground">Loading programs...</p>
                                                </div>
                                        </CardContent>
                                </Card>
                        </div>
                )
        }

        return (
                <div className="container mx-auto py-10">
                        <Card>
                                <CardHeader>
                                        <CardTitle>Social Protection Programs</CardTitle>
                                        <CardDescription>
                                                A comprehensive list of all registered social protection programs and their key details.
                                        </CardDescription>
                                </CardHeader>
                                <CardContent>
                                        <div className="rounded-md border">
                                                <Table>
                                                        <TableHeader>
                                                                {table.getHeaderGroups().map((headerGroup) => (
                                                                        <TableRow key={headerGroup.id}>
                                                                                {headerGroup.headers.map((header) => (
                                                                                        <TableHead key={header.id}>
                                                                                                {header.isPlaceholder
                                                                                                        ? null
                                                                                                        : flexRender(
                                                                                                                header.column.columnDef.header,
                                                                                                                header.getContext()
                                                                                                        )}
                                                                                        </TableHead>
                                                                                ))}
                                                                        </TableRow>
                                                                ))}
                                                        </TableHeader>
                                                        <TableBody>
                                                                {table.getRowModel().rows?.length ? (
                                                                        table.getRowModel().rows.map((row) => (
                                                                                <TableRow
                                                                                        key={row.id}
                                                                                        data-state={row.getIsSelected() && "selected"}
                                                                                >
                                                                                        {row.getVisibleCells().map((cell) => (
                                                                                                <TableCell key={cell.id}>
                                                                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                                                </TableCell>
                                                                                        ))}
                                                                                </TableRow>
                                                                        ))
                                                                ) : (
                                                                        <TableRow>
                                                                                <TableCell
                                                                                        colSpan={columns.length}
                                                                                        className="h-24 text-center"
                                                                                >
                                                                                        No programs found.
                                                                                </TableCell>
                                                                        </TableRow>
                                                                )}
                                                        </TableBody>
                                                </Table>
                                        </div>
                                </CardContent>
                        </Card>
                </div>
        )
}
