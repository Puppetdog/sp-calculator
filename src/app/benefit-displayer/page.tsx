// app/benefit-displayer/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from '@/components/data-table';
import { createColumns, programToTableData } from "./columns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getEligiblePrograms, calculateBenefitAmount } from '@/lib/actions';
import { ProgramSelect, type EligibilityParams, GENDER_VALUES, TYPE_OF_DEPENDENTS_VALUES, EMPLOYMENT_STATUS_VALUES, DISABILITY_STATUS_VALUES, CHRONIC_ILLNESS_VALUES, COUNTRY_VALUES } from '@/lib/schema';

type CountryCode = "1" | "2" | "3" | "4" | "5";
// Define the currency info type
type CurrencyInfo = {
        code: string;
        symbol: string;
        name: string;
}

type CurrencyMapping = {
        [key: string]: CurrencyInfo;
}

const currencyInfo: CurrencyMapping = {
        "1": { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" }, // Dominica
        "2": { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" }, // Grenada
        "3": { code: "JMD", symbol: "J$", name: "Jamaican Dollar" }, // Jamaica
        "4": { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" }, // Saint Lucia
        "5": { code: "TTD", symbol: "TT$", name: "Trinidad and Tobago Dollar" }, // Trinidad and Tobago
};

const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
                opacity: 1,
                y: 0,
                transition: {
                        duration: 0.5,
                        staggerChildren: 0.1
                }
        }
};

const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
};


export default function BenefitsDisplayer() {
        const searchParams = useSearchParams();
        const [eligiblePrograms, setEligiblePrograms] = useState<ProgramSelect[]>([]);
        const [currency, setCurrency] = useState<CurrencyInfo>(currencyInfo["1"]);
        const [isLoading, setIsLoading] = useState(true);
        const [activeTab, setActiveTab] = useState('summary');
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
                const fetchEligiblePrograms = async () => {
                        setIsLoading(true);
                        setError(null);

                        try {
                                // Get all required search params
                                const requiredParams = [
                                        'age',
                                        'gender',
                                        'numberOfDependents',
                                        'typeOfDependents',
                                        'employmentStatus',
                                        'disabilityStatus',
                                        'chronicIllnessStatus',
                                        'householdSize',
                                        'countryOfOrigin',
                                        'countryOfResidence'
                                ] as const;

                                // Initialize params with proper type checking
                                const params: EligibilityParams = {
                                        age: '',
                                        gender: '4' as const,
                                        numberOfDependents: '',
                                        typeOfDependents: '1' as const,
                                        employmentStatus: '5' as const,
                                        disabilityStatus: '4' as const,
                                        chronicIllnessStatus: '4' as const,
                                        householdSize: '',
                                        countryOfOrigin: '1' as const,
                                        countryOfResidence: '1' as const,
                                };

                                // Validate and collect all required parameters with type checking
                                for (const param of requiredParams) {
                                        const value = searchParams.get(param);
                                        if (!value) {
                                                throw new Error(`Missing required parameter: ${param}`);
                                        }

                                        // Type guard for enum values
                                        switch (param) {
                                                case 'age':
                                                case 'numberOfDependents':
                                                case 'householdSize':
                                                        params[param] = value; // These are string types in EligibilityParams
                                                        break;
                                                case 'gender':
                                                        if (GENDER_VALUES.includes(value as any)) {
                                                                params.gender = value as typeof GENDER_VALUES[number];
                                                        } else {
                                                                throw new Error(`Invalid gender value: ${value}`);
                                                        }
                                                        break;
                                                case 'typeOfDependents':
                                                        if (TYPE_OF_DEPENDENTS_VALUES.includes(value as any)) {
                                                                params.typeOfDependents = value as typeof TYPE_OF_DEPENDENTS_VALUES[number];
                                                        } else {
                                                                throw new Error(`Invalid type of dependents value: ${value}`);
                                                        }
                                                        break;
                                                case 'employmentStatus':
                                                        if (EMPLOYMENT_STATUS_VALUES.includes(value as any)) {
                                                                params.employmentStatus = value as typeof EMPLOYMENT_STATUS_VALUES[number];
                                                        } else {
                                                                throw new Error(`Invalid employment status value: ${value}`);
                                                        }
                                                        break;
                                                case 'disabilityStatus':
                                                        if (DISABILITY_STATUS_VALUES.includes(value as any)) {
                                                                params.disabilityStatus = value as typeof DISABILITY_STATUS_VALUES[number];
                                                        } else {
                                                                throw new Error(`Invalid disability status value: ${value}`);
                                                        }
                                                        break;
                                                case 'chronicIllnessStatus':
                                                        if (CHRONIC_ILLNESS_VALUES.includes(value as any)) {
                                                                params.chronicIllnessStatus = value as typeof CHRONIC_ILLNESS_VALUES[number];
                                                        } else {
                                                                throw new Error(`Invalid chronic illness status value: ${value}`);
                                                        }
                                                        break;
                                                case 'countryOfOrigin':
                                                case 'countryOfResidence':
                                                        if (COUNTRY_VALUES.includes(value as any)) {
                                                                params[param] = value as typeof COUNTRY_VALUES[number];
                                                        } else {
                                                                throw new Error(`Invalid country value for ${param}: ${value}`);
                                                        }
                                                        break;
                                        }
                                }
                                // Fetch eligible programs
                                const programs = await getEligiblePrograms(params);

                                // Calculate benefit amounts for each program
                                const programsWithBenefits = await Promise.all(
                                        programs.map(async (program) => {
                                                const benefitAmount = await calculateBenefitAmount(program.id, params);
                                                return {
                                                        ...program,
                                                        calculatedBenefit: benefitAmount
                                                };
                                        })
                                );

                                setEligiblePrograms(programsWithBenefits);

                                // Set currency based on country of residence
                                const countryCode = params.countryOfResidence;
                                if (countryCode in currencyInfo) {
                                        setCurrency(currencyInfo[countryCode]);
                                }

                        } catch (err) {
                                console.error('Error fetching programs:', err);
                                setError(err instanceof Error ? err.message : 'An error occurred');
                        } finally {
                                setIsLoading(false);
                        }
                };

                fetchEligiblePrograms();
        }, [searchParams]);
        // Calculate totals
        const totalCashTransfer = eligiblePrograms.reduce((sum, program) =>
                sum + (program.cashTransferMonthlyAmount || 0), 0);

        const totalInKindValue = eligiblePrograms.reduce((sum, program) =>
                sum + (program.inKindDollarValueAmt || 0), 0);

        const totalBenefits = totalCashTransfer + totalInKindValue;

        const tableData = eligiblePrograms.map(programToTableData);
        const countryCode = searchParams.get('countryOfResidence');
        const validCountryCode = COUNTRY_VALUES.includes(countryCode as any)
                ? (countryCode as CountryCode)
                : "1" as const;

        const columns = createColumns(validCountryCode);

        // Chart data
        const chartData = eligiblePrograms.map(program => ({
                name: program.programTitle,
                cashTransfer: program.cashTransferMonthlyAmount || 0,
                inKindValue: program.inKindDollarValueAmt || 0,
        }));

        const handleExportCSV = () => {
                const headers = ['Program Title', 'Organization', 'Description', 'Cash Transfer', 'In-Kind Value', 'Calculated Benefit'];
                const csvData = tableData.map(row => [
                        row.programTitle,
                        row.responsibleOrganization,
                        row.programDescription,
                        row.cashTransferMonthly,
                        row.inKindDollarValueAmt,
                ]);

                const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'benefits-summary.csv';
                a.click();
        };

        if (error) {
                return (
                        <div className="container mx-auto py-10">
                                <Card>
                                        <CardContent className="flex items-center justify-center p-6">
                                                <p className="text-red-500">{error}</p>
                                        </CardContent>
                                </Card>
                        </div>
                );
        }


        return (
                <AnimatePresence>
                        <motion.main
                                className="container mx-auto py-10 space-y-10"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                        >
                                <motion.div variants={itemVariants}>
                                        <h1 className="text-3xl font-bold text-center">Benefits Summary</h1>
                                        <p className="text-center text-muted-foreground">
                                                All amounts are in {currency.name} ({currency.code})
                                        </p>
                                </motion.div>

                                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                                        <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger value="summary">Summary</TabsTrigger>
                                                <TabsTrigger value="details">Program Details</TabsTrigger>
                                                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="summary">
                                                <motion.div
                                                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                                        variants={containerVariants}
                                                >
                                                        <motion.div variants={itemVariants}>
                                                                <Card>
                                                                        <CardHeader>
                                                                                <CardTitle>Total Cash Transfer</CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent>
                                                                                <p className="text-3xl font-bold">
                                                                                        {currency.symbol}{totalCashTransfer.toFixed(2)}
                                                                                </p>
                                                                        </CardContent>
                                                                </Card>
                                                        </motion.div>

                                                        <Card>
                                                                <CardHeader>
                                                                        <CardTitle>Total Benefits</CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                        <p className="text-3xl font-bold">{currency.symbol}{totalBenefits.toFixed(2)}</p>
                                                                </CardContent>
                                                        </Card>
                                                </motion.div>
                                        </TabsContent>

                                        <TabsContent value="details">
                                                <Card>
                                                        <CardHeader className="flex flex-row items-center justify-between">
                                                                <CardTitle>Eligible Programs</CardTitle>
                                                                <Button onClick={handleExportCSV} variant="outline">
                                                                        <Download className="mr-2 h-4 w-4" />
                                                                        Export CSV
                                                                </Button>
                                                        </CardHeader>
                                                        <CardContent>
                                                                {isLoading ? (
                                                                        <div className="flex items-center justify-center h-40">
                                                                                <motion.div
                                                                                        animate={{ rotate: 360 }}
                                                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                                        className="w-6 h-6 border-2 border-primary rounded-full border-t-transparent"
                                                                                />
                                                                        </div>
                                                                ) : (
                                                                        <DataTable columns={columns} data={tableData} />
                                                                )}
                                                        </CardContent>
                                                </Card>
                                        </TabsContent>

                                        <TabsContent value="visualization">
                                                <Card>
                                                        <CardHeader>
                                                                <CardTitle>Benefits Distribution</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                                <div className="w-full overflow-x-auto">
                                                                        <LineChart width={800} height={400} data={chartData}>
                                                                                <CartesianGrid strokeDasharray="3 3" />
                                                                                <XAxis dataKey="name" />
                                                                                <YAxis />
                                                                                <Tooltip />
                                                                                <Legend />
                                                                                <Line type="monotone" dataKey="cashTransfer" stroke="#8884d8" name="Cash Transfer" />
                                                                                <Line type="monotone" dataKey="inKindValue" stroke="#82ca9d" name="In-Kind Value" />
                                                                        </LineChart>
                                                                </div>
                                                        </CardContent>
                                                </Card>
                                        </TabsContent>
                                </Tabs>
                        </motion.main>
                </AnimatePresence>
        );
}
