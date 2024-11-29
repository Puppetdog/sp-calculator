
// utils/benefitConversions.ts

export type BenefitFrequency =
        | 'daily'
        | 'weekly'
        | 'biweekly'
        | 'monthly'
        | 'quarterly'
        | 'semiannually'
        | 'annually'
        | 'one-time';

export function convertToMonthly(
        amount: number,
        frequency: BenefitFrequency
): number {
        switch (frequency) {
                case 'daily':
                        return amount * 30; // Approximate days in a month
                case 'weekly':
                        return amount * 4; // Approximate weeks in a month
                case 'biweekly':
                        return amount * 2; // Twice a month
                case 'monthly':
                        return amount;
                case 'quarterly':
                        return amount / 3;
                case 'semiannually':
                        return amount / 6;
                case 'annually':
                        return amount / 12;
                case 'one-time':
                        // Decide how to handle one-time payments; here, we can treat it as zero monthly
                        return 0;
                default:
                        console.warn(`Unknown benefit frequency: ${frequency}. Treating as monthly.`);
                        return amount;
        }
}
