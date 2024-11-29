import { calculateBenefitsGap, getEligiblePrograms } from "@/lib/actions"; const sampleFormData = {
        basic: {
                age: "65",
                gender: "1",
                countryOfResidence: "TT",
        },
        household: {
                householdSize: "1",
                numberOfDependents: "0",
                monthlyIncome: "0" // No income
        },
        health: {
                disabilityStatus: "2", // Has disability
                chronicIllnessStatus: "1"
        },
        employment: {
                employmentStatus: "1" // Unemployed
        },
        documentation: {
                hasValidID: true,
                hasProofOfResidence: true,
                hasIncomeDocuments: true
        },
        preferences: {
                includeInKindBenefits: true,
                includeCashTransfers: true,
                includeEmergencyAssistance: false
        }
};
export default async function test() {
        const programs = await getEligiblePrograms(sampleFormData)
        const benefits = await calculateBenefitsGap(sampleFormData)
        console.log(programs)
        return (<div>{JSON.stringify(benefits)}</div>)
}
