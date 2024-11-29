
// src/components/programs/program-table.tsx
"use client"

import { useMemo, useState } from "react";
import { Building2, ScrollText, CheckCircle, ArrowUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EnhancedProgramResponse } from "@/lib/actions";
import { formatCurrency } from "@/lib/formatter";
import { SearchBar } from "./search-bar";
import ReactCountryFlag from "react-country-flag";
import { motion } from "framer-motion";

interface ProgramTableProps {
        programs: EnhancedProgramResponse[];
}

export function ProgramTable({ programs }: ProgramTableProps) {
        const [searchQuery, setSearchQuery] = useState("");
        const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

        const filteredPrograms = programs.filter(({ program }) =>
                program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                program.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const sortedPrograms = useMemo(() => {
                let sortablePrograms = [...filteredPrograms];
                if (sortConfig !== null) {
                        sortablePrograms.sort((a, b) => {
                                let aValue, bValue;
                                switch (sortConfig.key) {
                                        case 'title':
                                                aValue = a.program.title.toLowerCase();
                                                bValue = b.program.title.toLowerCase();
                                                break;
                                        case 'category':
                                                aValue = a.program.category.toLowerCase();
                                                bValue = b.program.category.toLowerCase();
                                                break;
                                        case 'benefits':
                                                aValue = a.metadata.benefits.minimumMonthly || 0;
                                                bValue = b.metadata.benefits.minimumMonthly || 0;
                                                break;
                                        default:
                                                return 0;
                                }

                                if (aValue < bValue) {
                                        return sortConfig.direction === 'ascending' ? -1 : 1;
                                }
                                if (aValue > bValue) {
                                        return sortConfig.direction === 'ascending' ? 1 : -1;
                                }
                                return 0;
                        });
                }
                return sortablePrograms;
        }, [filteredPrograms, sortConfig]);

        const handleSort = (key: string) => {
                let direction: 'ascending' | 'descending' = 'ascending';
                if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
                        direction = 'descending';
                }
                setSortConfig({ key, direction });
        };

        // Define animation variants for table rows
        const rowVariants = {
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
        };

        return (
                <div className="space-y-4">
                        <div className="flex justify-end">
                                <SearchBar onSearchAction={setSearchQuery} />
                        </div>
                        <Table>
                                <TableHeader>
                                        <TableRow>
                                                <TableHead className="w-[40%]">
                                                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('title')}>
                                                                Program Details <ArrowUpDown className="h-4 w-4" />
                                                        </div>
                                                </TableHead>
                                                <TableHead>
                                                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('category')}>
                                                                Documentation & Rules <ArrowUpDown className="h-4 w-4" />
                                                        </div>
                                                </TableHead>
                                                <TableHead>
                                                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('benefits')}>
                                                                Benefits <ArrowUpDown className="h-4 w-4" />
                                                        </div>
                                                </TableHead>
                                                <TableHead>Coverage</TableHead>
                                        </TableRow>
                                </TableHeader>
                                <TableBody>
                                        {sortedPrograms.map(({ program, metadata }) => (
                                                <motion.tr
                                                        key={program.id}
                                                        initial="hidden"
                                                        animate="visible"
                                                        variants={rowVariants}
                                                        transition={{ duration: 0.3 }}
                                                        className="border-b hover:bg-gray-50"
                                                >
                                                        <TableCell>
                                                                <div className="flex flex-col gap-2">
                                                                        <div className="flex items-center gap-2">
                                                                                {/* Country Flag */}
                                                                                <ReactCountryFlag
                                                                                        countryCode={program.countryCode}
                                                                                        svg
                                                                                        style={{
                                                                                                width: '1.5em',
                                                                                                height: '1.5em',
                                                                                        }}
                                                                                        title={program.countryCode}
                                                                                />
                                                                                <span className="font-medium">{program.title}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                                <Building2 className="h-4 w-4" />
                                                                                {program.responsibleOrganization}
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                                <Badge variant="outline">{program.category.replace('_', ' ')}</Badge>
                                                                                <Badge variant="outline">{program.type.replace('-', ' ')}</Badge>
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
                                                                                {program.benefitFrequency.charAt(0).toUpperCase() + program.benefitFrequency.slice(1)}
                                                                                {metadata.benefits.reapplicationPeriod &&
                                                                                        ` • ${metadata.benefits.reapplicationPeriod} month renewal`}
                                                                        </div>
                                                                </div>
                                                        </TableCell>
                                                        <TableCell>
                                                                <div className="flex flex-wrap gap-1">
                                                                        {metadata.coverage.regions.length > 0 ? (
                                                                                metadata.coverage.regions.map(region => (
                                                                                        <Badge key={region} variant="secondary">
                                                                                                {region.charAt(0).toUpperCase() + region.slice(1)}
                                                                                        </Badge>
                                                                                ))
                                                                        ) : (
                                                                                <Badge variant="outline">N/A</Badge>
                                                                        )}
                                                                </div>
                                                        </TableCell>
                                                </motion.tr>
                                        ))}
                                </TableBody>
                        </Table>
                        {sortedPrograms.length === 0 && (
                                <div className="text-center text-muted-foreground py-4">
                                        No programs found matching your search criteria.
                                </div>
                        )}
                </div>
        );
}
