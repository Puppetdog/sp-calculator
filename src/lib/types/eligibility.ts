export interface EligibilityParams {
        // Basic Demographics
        age: string;
        gender: string;
        countryOfResidence: string;
        countryOfOrigin?: string;

        // Household
        householdSize: string;
        numberOfDependents: string;
        typeOfDependents?: string;
        householdIncomePerPerson?: string;
        monthlyIncome?: string;

        // Employment
        employmentStatus: string;
        employmentSector?: string;
        socialSecurityNumber?: string;

        // Health
        disabilityStatus: string;
        disabilityType?: string;
        chronicIllnessStatus: string;
        requiresMedicalCare?: string;

        // Derived Values
        dependencyRatio?: string;
        isVulnerable?: string;
        vulnerabilityScore?: string;

        // Documentation Status
        hasValidID?: boolean;
        hasProofOfResidence?: boolean;
        hasIncomeDocuments?: boolean;
}
