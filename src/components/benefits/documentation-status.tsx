// src/components/benefits/documentation-status.tsx
"use client"

import { CheckCircle2, XCircle } from "lucide-react";
import type { ProcessedProgramResponse } from "@/lib/actions";

interface DocumentationStatusProps {
        program: ProcessedProgramResponse;
}

export function DocumentationStatus({ program }: DocumentationStatusProps) {
        return (
                <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{program.program.title}</h3>
                        <div className="grid gap-2">
                                {Object.entries(program.documentationStatus).map(([doc, status]) => (
                                        <div key={doc} className="flex items-center justify-between">
                                                <span className="text-sm">{doc.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                {status ? (
                                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                        <XCircle className="h-5 w-5 text-red-500" />
                                                )}
                                        </div>
                                ))}
                        </div>
                </div>
        );
}
