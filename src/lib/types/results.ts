import { GeographicCoverage, Program, RequiredDocument } from "./programs";

export interface ProgramResult {
  program: Program;
  eligibilityScore: number;
  calculatedBenefit: number;
  matchedRules: string[];
  failedRules: string[];
  requiredDocuments: RequiredDocument[];
  geographicCoverage: GeographicCoverage[];
  mebComparison: {
    amount: number;
    percentage: number;
    gap: number;
  };
}
