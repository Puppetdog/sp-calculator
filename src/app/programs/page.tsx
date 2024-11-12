"use client"

import {
        ColumnDef,
        flexRender,
        getCoreRowModel,
        useReactTable,
        getPaginationRowModel,
        getFilteredRowModel,
        SortingState,
        getSortedRowModel,
} from "@tanstack/react-table"
import { useState, useEffect } from "react"
import {
        Building2,
        Calendar,
        Users,
        CircleDollarSign,
        Package,
        Search,
        PersonStanding,
        Heart,
        Home,
        Flag
} from "lucide-react"

import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table"
import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { programs } from "@/lib/schema"
import { listPrograms } from "@/lib/actions"
import { Skeleton } from "@/components/ui/skeleton"

type Program = typeof programs.$inferSelect

// Value mappings based on the add programs form
const VALUE_MAPPINGS = {
        gender: {
                "1": "Male",
                "2": "Female",
                "3": "Other",
                "4": "Any"
        },
        employmentStatus: {
                "1": "Unemployed",
                "2": "Seasonally Employed",
                "3": "Permanently Employed",
                "4": "Self Employed",
                "5": "Any"
        },
        disabilityStatus: {
                "1": "None",
                "2": "Moderate",
                "3": "Severe",
                "4": "Any"
        },
        chronicIllnessStatus: {
                "1": "None",
                "2": "Moderate",
                "3": "Severe",
                "4": "Any"
        },
        typeOfDependents: {
                "1": "Children",
                "2": "Elderly",
                "3": "Mixed"
        },
        programCountry: {
                "1": "Dominica",
                "2": "Grenada",
                "3": "Jamaica",
                "4": "Saint Lucia",
                "5": "Trinidad and Tobago"
        }
}

const COUNTRY_FLAGS: Record<string, string> = {
        "1": "🇩🇲",
        "2": "🇬🇩",
        "3": "🇯🇲",
        "4": "🇱🇨",
        "5": "🇹🇹"
}

const columns: ColumnDef<Program>[] = [
        {
                accessorKey: "programTitle",
                header: "Program Details",
                cell: ({ row }) => {
                        const countryCode = row.original.programCountry as keyof typeof VALUE_MAPPINGS.programCountry
                        return (
                                <div className="flex flex-col gap-2">
                                        <div className="font-medium">{row.getValue("programTitle")}</div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Building2 className="h-4 w-4" />
                                                {row.original.responsibleOrganization}
                                        </div>
                                        <Badge variant="outline" className="w-fit">
                                                {COUNTRY_FLAGS[countryCode]} {VALUE_MAPPINGS.programCountry[countryCode]}
                                        </Badge>
                                </div>
                        )
                },
        },
        {
                accessorKey: "eligibility",
                header: "Eligibility Criteria",
                cell: ({ row }) => {
                        const gender = VALUE_MAPPINGS.gender[row.original.gender as keyof typeof VALUE_MAPPINGS.gender]
                        const employment = VALUE_MAPPINGS.employmentStatus[row.original.employmentStatus as keyof typeof VALUE_MAPPINGS.employmentStatus]
                        return (
                                <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                        {row.original.ageMinimum === 0 && row.original.ageMaximum === 150
                                                                ? "All ages"
                                                                : `${row.original.ageMinimum}-${row.original.ageMaximum} years`}
                                                </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                                <PersonStanding className="h-4 w-4 text-muted-foreground" />
                                                <span>{gender}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>{employment}</span>
                                        </div>
                                </div>
                        )
                },
        },
        {
                accessorKey: "healthStatus",
                header: "Health Conditions",
                cell: ({ row }) => {
                        const disability = VALUE_MAPPINGS.disabilityStatus[row.original.disabilityStatus as keyof typeof VALUE_MAPPINGS.disabilityStatus]
                        const chronicIllness = VALUE_MAPPINGS.chronicIllnessStatus[row.original.chronicIllnessStatus as keyof typeof VALUE_MAPPINGS.chronicIllnessStatus]
                        return (
                                <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                                <Heart className="h-4 w-4 text-muted-foreground" />
                                                <Badge variant="secondary">Disability: {disability}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                                <Heart className="h-4 w-4 text-muted-foreground" />
                                                <Badge variant="secondary">Chronic Illness: {chronicIllness}</Badge>
                                        </div>
                                </div>
                        )
                },
        },
        {
                accessorKey: "householdInfo",
                header: "Household Information",
                cell: ({ row }) => {
                        const dependentType = VALUE_MAPPINGS.typeOfDependents[row.original.typeOfDependents as keyof typeof VALUE_MAPPINGS.typeOfDependents]
                        return (
                                <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                                <Home className="h-4 w-4 text-muted-foreground" />
                                                <span>Household size: {row.original.householdSize}+</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>Dependents: {row.original.numberOfDependents} ({dependentType})</span>
                                        </div>
                                        {row.original.citizenshipRequired && (
                                                <div className="flex items-center gap-2">
                                                        <Flag className="h-4 w-4 text-muted-foreground" />
                                                        <Badge>Citizenship Required</Badge>
                                                </div>
                                        )}
                                </div>
                        )
                },
        },
        {
                accessorKey: "benefits",
                header: "Benefits",
                cell: ({ row }) => {
                        return (
                                <div className="space-y-2">
                                        {row.original.cashTransfer && (
                                                <div className="flex items-center gap-2">
                                                        <CircleDollarSign className="h-4 w-4 text-green-500" />
                                                        <span>
                                                                Cash Transfer: {row.original.cashTransferMonthlyAmount ? (
                                                                        <span className="font-medium">
                                                                                {new Intl.NumberFormat('en-US', {
                                                                                        style: 'currency',
                                                                                        currency: 'USD'
                                                                                }).format(row.original.cashTransferMonthlyAmount)}/month
                                                                        </span>
                                                                ) : 'Variable'}
                                                        </span>
                                                </div>
                                        )}
                                        {row.original.inKindTransfer && (
                                                <div className="flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-blue-500" />
                                                        <span>
                                                                In-Kind Transfer {row.original.inKindDollarValueAmt ? (
                                                                        <span className="font-medium">
                                                                                (Value: {new Intl.NumberFormat('en-US', {
                                                                                        style: 'currency',
                                                                                        currency: 'USD'
                                                                                }).format(row.original.inKindDollarValueAmt)})
                                                                        </span>
                                                                ) : ''}
                                                        </span>
                                                </div>
                                        )}
                                </div>
                        )
                },
        },
]

// ... rest of the component remains the same with updated table structure
function ProgramSkeleton() {
        return (
                <div className="space-y-4">
                        <Skeleton className="h-8 w-[200px]" />
                        <Skeleton className="h-[300px] w-full" />
                </div>
        )
}

export default function ProgramsPage() {
        const [programs, setPrograms] = useState<Program[]>([])
        const [loading, setLoading] = useState(true)
        const [sorting, setSorting] = useState<SortingState>([])
        const [globalFilter, setGlobalFilter] = useState('')

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
                getPaginationRowModel: getPaginationRowModel(),
                getFilteredRowModel: getFilteredRowModel(),
                getSortedRowModel: getSortedRowModel(),
                state: {
                        sorting,
                        globalFilter,
                },
                onSortingChange: setSorting,
                onGlobalFilterChange: setGlobalFilter,
        })

        if (loading) {
                return (
                        <div className="container mx-auto py-10">
                                <Card>
                                        <CardContent className="p-6">
                                                <ProgramSkeleton />
                                        </CardContent>
                                </Card>
                        </div>
                )
        }

        return (
                <div className="container mx-auto py-10">
                        <Card>
                                <CardHeader>
                                        <div className="flex items-center justify-between">
                                                <div>
                                                        <CardTitle className="text-2xl">Social Protection Programs</CardTitle>
                                                        <CardDescription className="mt-2">
                                                                Explore {programs.length} programs across the Caribbean region
                                                        </CardDescription>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                        <div className="relative w-64">
                                                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                <Input
                                                                        placeholder="Search programs..."
                                                                        value={globalFilter}
                                                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                                                        className="pl-8"
                                                                />
                                                        </div>
                                                </div>
                                        </div>
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
                                                                                        className="hover:bg-muted/50 cursor-pointer transition-colors"
                                                                                >
                                                                                        {row.getVisibleCells().map((cell) => (
                                                                                                <TableCell key={cell.id}>
                                                                                                        {flexRender(
                                                                                                                cell.column.columnDef.cell,
                                                                                                                cell.getContext()
                                                                                                        )}
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

                                        <div className="flex items-center justify-between space-x-2 py-4">
                                                <div className="flex-1 text-sm text-muted-foreground">
                                                        Showing {table.getRowModel().rows.length} of {programs.length} programs
                                                </div>
                                                <div className="space-x-2">
                                                        <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => table.previousPage()}
                                                                disabled={!table.getCanPreviousPage()}
                                                        >
                                                                Previous
                                                        </Button>
                                                        <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => table.nextPage()}
                                                                disabled={!table.getCanNextPage()}
                                                        >
                                                                Next
                                                        </Button>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>
                </div>
        )
}
