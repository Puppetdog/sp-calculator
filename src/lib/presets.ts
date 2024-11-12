export interface DemographicPreset {
        id: string;
        label: string;
        description: string;
        values: {
                age: string;
                gender: string;
                numberOfDependents: string;
                typeOfDependents: string;
                employmentStatus: string;
                disabilityStatus: string;
                chronicIllnessStatus: string;
                householdSize: string;
                countryOfOrigin: string;
                countryOfResidence: string;
        };
}

export const demographicPresets: DemographicPreset[] = [
        {
                id: "single-parent",
                label: "Single Parent with Children",
                description: "Parent with 2 dependent children",
                values: {
                        age: "30",
                        gender: "2", // Female
                        numberOfDependents: "2",
                        typeOfDependents: "1", // Children
                        employmentStatus: "3", // Permanently Employed
                        disabilityStatus: "1", // None
                        chronicIllnessStatus: "1", // None
                        householdSize: "3",
                        countryOfOrigin: "1", // Local
                        countryOfResidence: "1" // Dominica
                }
        },
        {
                id: "elderly-disabled",
                label: "Elderly with Disability",
                description: "Senior citizen with moderate disability",
                values: {
                        age: "65",
                        gender: "4", // Any
                        numberOfDependents: "0",
                        typeOfDependents: "1", // Children
                        employmentStatus: "1", // Unemployed
                        disabilityStatus: "2", // Moderate
                        chronicIllnessStatus: "2", // Moderate
                        householdSize: "1",
                        countryOfOrigin: "1", // Local
                        countryOfResidence: "1" // Dominica
                }
        },
        {
                id: "young-unemployed",
                label: "Young Unemployed Adult",
                description: "Young adult seeking employment",
                values: {
                        age: "22",
                        gender: "4", // Any
                        numberOfDependents: "0",
                        typeOfDependents: "1", // Children
                        employmentStatus: "1", // Unemployed
                        disabilityStatus: "1", // None
                        chronicIllnessStatus: "1", // None
                        householdSize: "1",
                        countryOfOrigin: "1", // Local
                        countryOfResidence: "1" // Dominica
                }
        }
];
