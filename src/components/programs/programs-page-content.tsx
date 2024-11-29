
// src/components/programs/programs-page-content.tsx
'use client';

import {
        Package,
        FileText,
        MapPin,
        CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgramTable } from "./program-table"; // Adjust the import path if necessary
import { StatCard } from "@/components/ui/stat-card";
import { EnhancedProgramResponse } from "@/lib/actions";
import { calculateTotalDocuments, calculateUniqueRegions } from "@/lib/actions";
import { motion } from "framer-motion";

interface ProgramsPageContentProps {
        programs: EnhancedProgramResponse[];
}

export function ProgramsPageContent({ programs }: ProgramsPageContentProps) {
        // Define animation variants for the page components
        const containerVariants = {
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.8 } },
        };

        const statsVariants = {
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.4 } },
        };

        const statCardVariants = {
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
        };

        const cardVariants = {
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.8 } },
        };

        return (
                <motion.div
                        className="container mx-auto py-10 space-y-8"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                >
                        {/* Statistics Overview */}
                        <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                                variants={statsVariants}
                        >
                                <motion.div variants={statCardVariants}>
                                        <StatCard
                                                title="Total Programs"
                                                value={programs.length}
                                                icon={Package}
                                                description="Active social protection programs"
                                        />
                                </motion.div>
                                <motion.div variants={statCardVariants}>
                                        <StatCard
                                                title="Required Documents"
                                                value={calculateTotalDocuments(programs)}
                                                icon={FileText}
                                                description="Across all programs"
                                        />
                                </motion.div>
                                <motion.div variants={statCardVariants}>
                                        <StatCard
                                                title="Geographic Regions"
                                                value={calculateUniqueRegions(programs)}
                                                icon={MapPin}
                                                description="Unique covered regions"
                                        />
                                </motion.div>
                                <motion.div variants={statCardVariants}>
                                        <StatCard
                                                title="Active Eligibility Rules"
                                                value={programs.reduce((sum, p) =>
                                                        sum + p.metadata.eligibilityRules.activeRules, 0
                                                )}
                                                icon={CheckCircle}
                                                description="Total active rules"
                                        />
                                </motion.div>
                        </motion.div>

                        {/* Programs Directory Card */}
                        <motion.div
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                        >
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
                        </motion.div>
                </motion.div>
        );
}
