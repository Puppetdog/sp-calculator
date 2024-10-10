'use client'

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from '@/components/data-table';
import { socialProtectionProgramSchema, SocialProtectionProgram, createColumns } from "./columns";
import { generateMock } from "@anatine/zod-mock";
import seedrandom from 'seedrandom';
import { ColumnDef } from '@tanstack/react-table';

export const runtime = 'edge';
// Currency information for each country
const currencyInfo = {
        "1": { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" }, // Dominica
        "2": { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" }, // Grenada
        "3": { code: "JMD", symbol: "J$", name: "Jamaican Dollar" }, // Jamaica
        "4": { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" }, // Saint Lucia
        "5": { code: "TTD", symbol: "TT$", name: "Trinidad and Tobago Dollar" }, // Trinidad and Tobago
};

// Default currency (using Dominica's currency as default)
const defaultCurrency = currencyInfo["1"];

// Generate seeded mock data
function generateSeededMockData(seed: string): SocialProtectionProgram[] {
        const rng = seedrandom(seed);
        return Array.from({ length: 5000 }, () =>
                generateMock(socialProtectionProgramSchema));
}

// Define the type for the table data
type TableData = {
        programTitle: string;
        responsibleOrganization: string;
        programDescription: string;
        cashTransferMonthly: number;
        inKindDollarValueAmt: number;
};

// Use a constant seed for consistent data generation
const MOCK_DATA_SEED = "constant-seed-for-mock-data";

export default function BenefitsDisplayer() {
        const searchParams = useSearchParams();
        const [filteredPrograms, setFilteredPrograms] = useState<SocialProtectionProgram[]>([]);
        const [currency, setCurrency] = useState(defaultCurrency);
        const [tableData, setTableData] = useState<TableData[]>([]);
        const [columns, setColumns] = useState<ColumnDef<TableData>[]>([]);

        useEffect(() => {
                const mockPrograms = generateSeededMockData(MOCK_DATA_SEED);

                const age = searchParams.get('age');
                const gender = searchParams.get('gender');
                const numberOfDependents = searchParams.get('numberOfDependents');
                const typeOfDependents = searchParams.get('typeOfDependents');
                const disabilityStatus = searchParams.get('disabilityStatus');
                const chronicIllnessStatus = searchParams.get('chronicIllnessStatus');
                const employmentStatus = searchParams.get('employmentStatus');
                const householdSize = searchParams.get('householdSize');
                const countryOfOrigin = searchParams.get('countryOfOrigin');
                const countryOfResidence = searchParams.get('countryOfResidence');

                if (!age || !gender || !numberOfDependents || !typeOfDependents || !disabilityStatus ||
                        !chronicIllnessStatus || !employmentStatus || !householdSize || !countryOfOrigin || !countryOfResidence) {
                        // Handle the case where not all parameters are present
                        return;
                }

                const filtered = mockPrograms.filter(program =>
                        program.ageMinimum <= parseInt(age) &&
                        program.ageMaximum >= parseInt(age) &&
                        program.numberOfDependents >= parseInt(numberOfDependents) &&
                        program.householdSize >= parseInt(householdSize) &&
                        (program.typeOfDependents === typeOfDependents || program.typeOfDependents === '3') &&
                        (program.gender === gender || program.gender === '4') &&
                        (program.employmentStatus === employmentStatus || program.employmentStatus === '5') &&
                        (program.chronicIllnessStatus <= chronicIllnessStatus || program.chronicIllnessStatus === '4') &&
                        (program.disabilityStatus <= disabilityStatus || program.disabilityStatus === '4') &&
                        program.countryOfResidence === countryOfResidence &&
                        (program.countryOfOrigin === countryOfOrigin || program.countryOfOrigin === '3')
                );

                setFilteredPrograms(filtered);

                // Set the currency based on countryOfResidence
                const selectedCurrency = currencyInfo[countryOfResidence as keyof typeof currencyInfo] || defaultCurrency;
                setCurrency(selectedCurrency);
                const countryCode = countryOfResidence as keyof typeof currencyInfo;
                const columns = createColumns(countryCode);
                setColumns(columns)

                // Prepare table data
                const newTableData: TableData[] = filtered.map(program => ({
                        programTitle: program.programTitle,
                        responsibleOrganization: program.responsibleOrganization,
                        programDescription: program.programDescription,
                        cashTransferMonthly: program.cashTransferMonthly,
                        inKindDollarValueAmt: program.inKindDollarValueAmt,
                }));
                setTableData(newTableData);
        }, [searchParams]);

        const totalCashTransfer = filteredPrograms.reduce((sum, program) => sum + program.cashTransferMonthly, 0);
        const totalInKindValue = filteredPrograms.reduce((sum, program) => sum + program.inKindDollarValueAmt, 0);
        const totalBenefits = totalCashTransfer + totalInKindValue;

        return (
                <main className="container mx-auto py-10 space-y-10">
                        <h1 className="text-3xl font-bold text-center">Benefits Summary</h1>
                        <p className="text-center text-muted-foreground">All amounts are in {currency.name} ({currency.code})</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Total Cash Transfer</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                                <p className="text-3xl font-bold">{currency.symbol}{totalCashTransfer.toFixed(2)}</p>
                                        </CardContent>
                                </Card>

                                <Card>
                                        <CardHeader>
                                                <CardTitle>Total In-Kind Value</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                                <p className="text-3xl font-bold">{currency.symbol}{totalInKindValue.toFixed(2)}</p>
                                        </CardContent>
                                </Card>

                                <Card>
                                        <CardHeader>
                                                <CardTitle>Total Benefits</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                                <p className="text-3xl font-bold">{currency.symbol}{totalBenefits.toFixed(2)}</p>
                                        </CardContent>
                                </Card>
                        </div>

                        <Card>
                                <CardHeader>
                                        <CardTitle>Eligible Programs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                        <DataTable columns={columns} data={tableData} />
                                </CardContent>
                        </Card>
                </main>
        );
}
