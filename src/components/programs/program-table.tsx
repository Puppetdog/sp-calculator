// src/components/programs/program-table.tsx
"use client"

import { useState } from "react";
import { Building2, ScrollText, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EnhancedProgramResponse } from "@/lib/actions";
import { formatCurrency } from "@/lib/formatter";
import { SearchBar } from "./search-bar";

interface ProgramTableProps {
        programs: EnhancedProgramResponse[];
}

export function ProgramTable({ programs }: ProgramTableProps) {
        const [searchQuery, setSearchQuery] = useState("");

        const filteredPrograms = programs.filter(({ program }) =>
                program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                program.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
                <div className="space-y-4">
                        <div className="flex justify-end">
                                <SearchBar onSearchAction={setSearchQuery} />
                        </div>
                        <Table>
                                <TableHeader>
                                        <TableRow>
                                                <TableHead className="w-[40%]">Program Details</TableHead>
                                                <TableHead>Documentation & Rules</TableHead>
                                                <TableHead>Benefits</TableHead>
                                                <TableHead>Coverage</TableHead>
                                        </TableRow>
                                </TableHeader>
                                <TableBody>
                                        {filteredPrograms.map(({ program, metadata }) => (
                                                <TableRow key={program.id}>
                                                        <TableCell>
                                                                <div className="flex flex-col gap-2">
                                                                        <span className="font-medium">{program.title}</span>
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                                <Building2 className="h-4 w-4" />
                                                                                {program.responsibleOrganization}
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                                <Badge variant="outline">{program.category}</Badge>
                                                                                <Badge variant="outline">{program.type}</Badge>
                                                                        </div>
                                                                </div>
                                                        </TableCell>
                                                        <TableCell>
                                                                <div className="space-y-2">
                                                                        <div className="flex items-center gap-2">
                                                                                <ScrollText className="h-4 w-4 text-muted-foreground" />
                                                                                <span>{metadata.documentationRequirements.total} documents required</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                                                                <span>{metadata.eligibilityRules.activeRules} eligibility rules</span>
                                                                        </div>
                                                                </div>
                                                        </TableCell>
                                                        <TableCell>
                                                                <div className="space-y-2">
                                                                        <div className="font-medium">
                                                                                {metadata.benefits.minimumMonthly !== null && metadata.benefits.maximumMonthly !== null
                                                                                        ? `${formatCurrency(metadata.benefits.minimumMonthly)} - ${formatCurrency(metadata.benefits.maximumMonthly)}`
                                                                                        : metadata.benefits.minimumMonthly !== null
                                                                                                ? formatCurrency(metadata.benefits.minimumMonthly)
                                                                                                : "Variable"}
                                                                        </div>
                                                                        <div className="text-sm text-muted-foreground">
                                                                                {program.benefitFrequency}
                                                                                {metadata.benefits.reapplicationPeriod &&
                                                                                        ` • ${metadata.benefits.reapplicationPeriod} month renewal`}
                                                                        </div>
                                                                </div>
                                                        </TableCell>
                                                        <TableCell>
                                                                <div className="flex flex-wrap gap-1">
                                                                        {metadata.coverage.regions.map(region => (
                                                                                <Badge key={region} variant="secondary">
                                                                                        {region}
                                                                                </Badge>
                                                                        ))}
                                                                </div>
                                                        </TableCell>
                                                </TableRow>
                                        ))}
                                </TableBody>
                        </Table>
                </div>
        );
}
