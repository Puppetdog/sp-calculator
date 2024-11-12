import { programs, benefitConditions } from './schema';

export type Programs = typeof programs.$inferSelect;
export type BenefitConditions = typeof benefitConditions.$inferSelect;

export interface ProgramWithBenefits extends Programs {
        benefitConditions: BenefitConditions[];
        calculatedBenefit?: number;
}

export interface TableData {
        programTitle: string;
        responsibleOrganization: string;
        programDescription: string;
        cashTransferMonthly: number;
        inKindDollarValueAmt: number;
        calculatedBenefit: number;
}


export interface Beneficiary {
        age: number;
        gender: string;
        numberOfDependents: number;
        householdSize: number;
        employmentStatus: string;
        disabilityStatus: string;
        chronicIllnessStatus: string;
        countryOfResidence: string;
        countryOfOrigin: string;
}
