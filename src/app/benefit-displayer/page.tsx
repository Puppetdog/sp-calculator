
// app/benefits-displayer/page.tsx
import { redirect } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { ProgressAnimation } from "@/components/benefits/progress-animation";
import { DocumentationStatus } from "@/components/benefits/documentation-status";
import { formatCurrency } from "@/lib/formatter";
import { getEligiblePrograms, calculateBenefitsGap } from '@/lib/actions';
import { FormSubmissionData } from '@/lib/types/forms';

export const runtime = 'edge';

// Define the expected shape of our search parameters

// Helper function to unflatten the object
function unflatten(data: { [key: string]: any }): { [key: string]: any } {
        const result: { [key: string]: any } = {};
        for (const flatKey in data) {
                const keys = flatKey.split('.');
                keys.reduce((acc, key, index) => {
                        if (index === keys.length - 1) {
                                acc[key] = data[flatKey];
                        } else {
                                acc[key] = acc[key] || {};
                        }
                        return acc[key];
                }, result);
        }
        return result;
}

function normalizeValues(obj: any): any {
        if (typeof obj !== 'object' || obj === null) return obj;

        for (const key in obj) {
                if (typeof obj[key] === 'object') {
                        normalizeValues(obj[key]);
                } else {
                        const value = obj[key];
                        if (value === 'true') {
                                obj[key] = true;
                        } else if (value === 'false') {
                                obj[key] = false;
                        }
                        // Do not convert numeric strings to numbers
                        // Leave other strings as they are
                }
        }
        return obj;
}

export default async function BenefitsDisplayerPage({ searchParams }: any) {
        try {
                // No await needed since searchParams is already an object
                const dataParams = await searchParams;
                const data = unflatten(dataParams);
                console.log("flattened data:", data);
                // Normalize string values to appropriate types
                normalizeValues(data);

                // Cast data to FormSubmissionData if necessary
                const formData = data as FormSubmissionData;

                // Call the server actions to get eligible programs and benefits gap
                const [eligiblePrograms, benefitsGap] = await Promise.all([
                        getEligiblePrograms(formData),
                        calculateBenefitsGap(formData)
                ]);

                // If we don't have valid results data, redirect to home
                if (!eligiblePrograms || !benefitsGap) {
                        redirect('/');
                }

                return (
                        <div className="container mx-auto p-6 space-y-6 max-w-4xl">
                                {/* Summary Card */}
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Benefits Eligibility Results</CardTitle>
                                                <CardDescription>
                                                        Based on your information, you may be eligible for the following benefits
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="grid gap-6 md:grid-cols-3">
                                                        <div className="space-y-2">
                                                                <p className="text-sm text-muted-foreground">Total Eligible Programs</p>
                                                                <p className="text-2xl font-bold">{eligiblePrograms.length}</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                                <p className="text-sm text-muted-foreground">Total Benefits Value</p>
                                                                <p className="text-2xl font-bold">{formatCurrency(benefitsGap.totalBenefits)}</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                                <p className="text-sm text-muted-foreground">MEB Coverage</p>
                                                                <div className="space-y-2">
                                                                        <ProgressAnimation value={benefitsGap.coverage} />
                                                                        <p className="text-sm text-right">{Math.round(benefitsGap.coverage)}%</p>
                                                                </div>
                                                        </div>
                                                </div>
                                        </CardContent>
                                </Card>

                                {/* Benefits Gap Analysis */}
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Benefits Gap Analysis</CardTitle>
                                                <CardDescription>Comparison with Minimum Expenditure Basket (MEB)</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="space-y-4">
                                                        <div className="flex justify-between items-center">
                                                                <span>Monthly MEB Amount</span>
                                                                <span className="font-semibold">{formatCurrency(benefitsGap.mebAmount)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                                <span>Total Benefits</span>
                                                                <span className="font-semibold">{formatCurrency(benefitsGap.totalBenefits)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-red-500">
                                                                <span>Coverage Gap</span>
                                                                <span className="font-semibold">{formatCurrency(benefitsGap.gap)}</span>
                                                        </div>
                                                </div>
                                        </CardContent>
                                </Card>

                                {/* Eligible Programs Table */}
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Eligible Programs</CardTitle>
                                                <CardDescription>Detailed breakdown of programs you may qualify for</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <Table>
                                                        <TableHeader>
                                                                <TableRow>
                                                                        <TableHead>Program</TableHead>
                                                                        <TableHead>Eligibility Score</TableHead>
                                                                        <TableHead>Monthly (Estimated) Benefit Amount</TableHead>
                                                                        <TableHead>Frequency</TableHead>
                                                                </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                                {eligiblePrograms.map((program) => (
                                                                        <TableRow key={program.program.id}>
                                                                                <TableCell className="font-medium">{program.program.title}</TableCell>
                                                                                <TableCell>
                                                                                        <Badge
                                                                                                variant={
                                                                                                        program.eligibilityScore > 80
                                                                                                                ? "default"
                                                                                                                : program.eligibilityScore > 60
                                                                                                                        ? "secondary"
                                                                                                                        : "outline"
                                                                                                }
                                                                                        >
                                                                                                {Math.round(program.eligibilityScore)}%
                                                                                        </Badge>
                                                                                </TableCell>
                                                                                <TableCell>{formatCurrency(program.calculatedBenefit)}</TableCell>
                                                                                <TableCell>{program.program.benefitFrequency}</TableCell>
                                                                        </TableRow>
                                                                ))}
                                                        </TableBody>
                                                </Table>
                                        </CardContent>
                                </Card>

                                {/* Documentation Status Card */}
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Required Documentation</CardTitle>
                                                <CardDescription>Status of required documents for each program</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="space-y-4">
                                                        {eligiblePrograms.map((program) => (
                                                                <DocumentationStatus key={`docs-${program.program.id}`} program={program} />
                                                        ))}
                                                </div>
                                        </CardContent>
                                </Card>

                                {/* Geographic Coverage */}
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Geographic Coverage</CardTitle>
                                                <CardDescription>Coverage details for your location</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                {eligiblePrograms.map((program) => (
                                                        <div key={`geo-${program.program.id}`} className="mb-4 last:mb-0">
                                                                <h3 className="font-semibold mb-2">{program.program.title}</h3>
                                                                {program.geographicEligibility ? (
                                                                        <Alert>
                                                                                <CheckCircle2 className="h-4 w-4" />
                                                                                <AlertTitle>Coverage Confirmed</AlertTitle>
                                                                                <AlertDescription>This program is available in your area</AlertDescription>
                                                                        </Alert>
                                                                ) : (
                                                                        <Alert variant="destructive">
                                                                                <AlertCircle className="h-4 w-4" />
                                                                                <AlertTitle>Coverage Unavailable</AlertTitle>
                                                                                <AlertDescription>This program is not available in your area</AlertDescription>
                                                                        </Alert>
                                                                )}
                                                        </div>
                                                ))}
                                        </CardContent>
                                </Card>
                        </div>
                );
        } catch (error) {
                console.error('Error in BenefitsDisplayerPage:', error);
                redirect('/');
        }
}
