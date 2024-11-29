// src/lib/formatter.ts

/**
 * Utility functions for consistent data formatting across the application.
 * Having these in one place makes it easier to maintain consistent formatting
 * and make global changes if needed.
 */

/**
 * Formats a number as currency using the specified locale and currency code.
 * Default locale is 'en-US' and default currency is 'USD'.
 * 
 * @param amount - The number to format as currency
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param currency - The currency code to use (default: 'USD')
 * @returns A formatted currency string
 * 
 * Example outputs:
 * formatCurrency(1234.56) => "$1,234.56"
 * formatCurrency(1000) => "$1,000.00"
 * formatCurrency(null) => "N/A"
 */
export function formatCurrency(
        amount: number | null,
        locale: string = 'en-US',
        currency: string = 'USD'
): string {
        // Return "N/A" for null or undefined amounts
        if (amount === null || amount === undefined) {
                return "N/A";
        }

        // Use Intl.NumberFormat for consistent currency formatting
        return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
        }).format(amount);
}

/**
 * Formats a date string into a localized date format.
 * Useful for displaying dates consistently across the application.
 * 
 * @param date - The date string to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns A formatted date string
 * 
 * Example:
 * formatDate("2023-11-28") => "November 28, 2023"
 */
export function formatDate(
        date: string | Date,
        locale: string = 'en-US'
): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
        }).format(dateObj);
}

/**
 * Formats a number as a percentage with specified decimal places.
 * 
 * @param value - The number to format as a percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns A formatted percentage string
 * 
 * Example:
 * formatPercent(0.1234) => "12.3%"
 * formatPercent(0.1234, 2) => "12.34%"
 */
export function formatPercent(
        value: number,
        decimals: number = 1
): string {
        return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats a large number with abbreviations (K, M, B).
 * Useful for displaying large numbers in a readable format.
 * 
 * @param num - The number to format
 * @returns A formatted string with appropriate abbreviation
 * 
 * Examples:
 * formatLargeNumber(1234) => "1.2K"
 * formatLargeNumber(1234567) => "1.2M"
 */
export function formatLargeNumber(num: number): string {
        const abbreviations = ['', 'K', 'M', 'B'];
        const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

        if (tier === 0) return num.toString();

        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;

        return `${scaled.toFixed(1)}${abbreviations[tier]}`;
}
