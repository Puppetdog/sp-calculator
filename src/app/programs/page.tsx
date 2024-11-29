// src/app/programs/page.tsx
import {
        Package,
        FileText,
        MapPin,
        CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgramTable } from "@/components/programs/program-table";
import { StatCard } from "@/components/ui/stat-card";
import { listEnhancedPrograms, calculateTotalDocuments, calculateUniqueRegions } from "@/lib/actions";

export const runtime = 'edge'
export default async function ProgramsPage() {
        // Fetch data server-side
        const programs = await listEnhancedPrograms();

        return (
                <div className="container mx-auto py-10 space-y-8">
                        {/* Statistics Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard
                                        title="Total Programs"
                                        value={programs.length}
                                        icon={Package}
                                        description="Active social protection programs"
                                />
                                <StatCard
                                        title="Required Documents"
                                        value={calculateTotalDocuments(programs)}
                                        icon={FileText}
                                        description="Across all programs"
                                />
                                <StatCard
                                        title="Geographic Regions"
                                        value={calculateUniqueRegions(programs)}
                                        icon={MapPin}
                                        description="Unique covered regions"
                                />
                                <StatCard
                                        title="Active Eligibility Rules"
                                        value={programs.reduce((sum, p) =>
                                                sum + p.metadata.eligibilityRules.activeRules, 0
                                        )}
                                        icon={CheckCircle}
                                        description="Total active rules"
                                />
                        </div>

                        {/* Programs Directory Card */}
                        <Card>
                                <CardHeader>
                                        <CardTitle className="text-2xl">Program Directory</CardTitle>
                                        <CardDescription>
                                                Comprehensive view of all active social protection programs
                                        </CardDescription>
                                </CardHeader>
                                <CardContent>
                                        <ProgramTable programs={programs} />
                                </CardContent>
                        </Card>
                </div>
        );
}
