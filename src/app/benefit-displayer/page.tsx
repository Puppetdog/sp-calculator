
// app/benefits-displayer/page.tsx
import { redirect } from 'next/navigation';
import { getEligiblePrograms, calculateBenefitsGap } from '@/lib/actions';
import { FormSubmissionData } from '@/lib/types/forms';
import BenefitsDisplayerContent from '@/components/benefits/BenefitsDisplayerContent';

export const runtime = 'edge';

// Define the expected shape of our search parameters

// Helper function to unflatten the object
function unflatten(data: { [key: string]: any }): { [key: string]: any } {
        const result: { [key: string]: any } = {};
        for (const flatKey in data) {
                const keys = flatKey.split('.');
                keys.reduce((acc, key, index) => {
                        if (index === keys.length - 1) {
                                acc[key] = data[flatKey];
                        } else {
                                acc[key] = acc[key] || {};
                        }
                        return acc[key];
                }, result);
        }
        return result;
}

function normalizeValues(obj: any): any {
        if (typeof obj !== 'object' || obj === null) return obj;

        for (const key in obj) {
                if (typeof obj[key] === 'object') {
                        normalizeValues(obj[key]);
                } else {
                        const value = obj[key];
                        if (value === 'true') {
                                obj[key] = true;
                        } else if (value === 'false') {
                                obj[key] = false;
                        }
                        // Do not convert numeric strings to numbers
                        // Leave other strings as they are
                }
        }
        return obj;
}

export default async function BenefitsDisplayerPage({ searchParams }: any) {
        try {
                // No await needed since searchParams is already an object
                const dataParams = await searchParams;
                const data = unflatten(dataParams);
                console.log("flattened data:", data);
                // Normalize string values to appropriate types
                normalizeValues(data);

                // Cast data to FormSubmissionData if necessary
                const formData = data as FormSubmissionData;

                // Call the server actions to get eligible programs and benefits gap
                const [eligiblePrograms, benefitsGap] = await Promise.all([
                        getEligiblePrograms(formData),
                        calculateBenefitsGap(formData)
                ]);

                // If we don't have valid results data, redirect to home
                if (!eligiblePrograms || !benefitsGap) {
                        redirect('/');
                }

                return (
                        <BenefitsDisplayerContent eligiblePrograms={eligiblePrograms} benefitsGap={benefitsGap} />
                );
        } catch (error) {
                console.error('Error in BenefitsDisplayerPage:', error);
                redirect('/');
        }
}
