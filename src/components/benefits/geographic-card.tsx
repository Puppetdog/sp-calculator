// src/components/benefits/geographic-card.tsx
"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { ProcessedProgramResponse } from "@/lib/actions";

interface GeographicCardProps {
        program: ProcessedProgramResponse;
}

export function GeographicCard({ program }: GeographicCardProps) {
        return (
                <div className="mb-4 last:mb-0">
                        <h3 className="font-semibold mb-2">{program.program.title}</h3>
                        {program.geographicEligibility ? (
                                <Alert>
                                        <CheckCircle2 className="h-4 w-4" />
                                        <AlertTitle>Coverage Confirmed</AlertTitle>
                                        <AlertDescription>
                                                This program is available in your area
                                        </AlertDescription>
                                </Alert>
                        ) : (
                                <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Coverage Unavailable</AlertTitle>
                                        <AlertDescription>
                                                This program is not available in your area
                                        </AlertDescription>
                                </Alert>
                        )}
                </div>
        );
}
