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
        contributionsWeeks?: string; // Added for Old Age Pension

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
        backgroundCheckStatus?: string; // Added for Foster Care Programme

        // Education
        isEnrolledInSchool?: string; // Added for School Feeding Program

        // Emergency Status
        affectedByEmergency?: string; // Added for Emergency/Fire Grant
}
