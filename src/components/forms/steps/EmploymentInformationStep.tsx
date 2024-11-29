
// components/forms/steps/EmploymentInformationStep.tsx

import React, { useEffect } from 'react';
import {
        FormField,
        FormItem,
        FormLabel,
        FormControl,
        FormMessage,
        FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import type { FormSubmissionData } from '@/lib/types/forms';

export default function EmploymentInformationStep() {
        const { control, watch, setValue } = useFormContext<FormSubmissionData>();

        // Watch the employment status field
        const employmentStatus = watch('employment.employmentStatus');
        const isUnemployed = employmentStatus === '1'; // Assuming '1' is "Unemployed"

        // Handle side effects when employment status changes
        useEffect(() => {
                if (isUnemployed) {
                        // Reset dependent fields when employment status changes to 'Unemployed'
                        setValue('employment.employmentSector', '');
                        setValue('employment.monthsEmployed', '0');
                        setValue('employment.employmentHistory.seekingWork', false);
                }
        }, [isUnemployed, setValue]);

        return (
                <div className="space-y-4">
                        {/* Employment Status */}
                        <FormField
                                control={control}
                                name="employment.employmentStatus"
                                render={({ field }) => (
                                        <FormItem>
                                                <FormLabel>Employment Status</FormLabel>
                                                <FormDescription>Select your current employment status.</FormDescription>
                                                <FormControl>
                                                        <Select
                                                                onValueChange={field.onChange}
                                                                value={field.value}
                                                        >
                                                                <SelectTrigger>
                                                                        <SelectValue placeholder="Select employment status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                        <SelectItem value="1">Unemployed</SelectItem>
                                                                        <SelectItem value="2">Employed Full-time</SelectItem>
                                                                        <SelectItem value="3">Employed Part-time</SelectItem>
                                                                        <SelectItem value="4">Self-employed</SelectItem>
                                                                        <SelectItem value="5">Retired</SelectItem>
                                                                </SelectContent>
                                                        </Select>
                                                </FormControl>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />

                        {/* Conditional Fields: Employment Sector and Months Employed */}
                        <AnimatePresence>
                                {!isUnemployed && (
                                        <motion.div
                                                key="employmentDetails"
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={{
                                                        hidden: { opacity: 0, height: 0, overflow: 'hidden' },
                                                        visible: { opacity: 1, height: 'auto', overflow: 'hidden' },
                                                        exit: { opacity: 0, height: 0, overflow: 'hidden' },
                                                }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="space-y-4"
                                        >
                                                {/* Employment Sector */}
                                                <FormField
                                                        control={control}
                                                        name="employment.employmentSector"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Employment Sector</FormLabel>
                                                                        <FormDescription>Select your employment sector.</FormDescription>
                                                                        <FormControl>
                                                                                <Select
                                                                                        onValueChange={field.onChange}
                                                                                        value={field.value}
                                                                                >
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Select sector" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                <SelectItem value="public">Public Sector</SelectItem>
                                                                                                <SelectItem value="private">Private Sector</SelectItem>
                                                                                                <SelectItem value="ngo">NGO/Non-profit</SelectItem>
                                                                                                <SelectItem value="informal">Informal Sector</SelectItem>
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                {/* Months in Current Employment */}
                                                <FormField
                                                        control={control}
                                                        name="employment.monthsEmployed"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Months in Current Employment</FormLabel>
                                                                        <FormDescription>
                                                                                Enter the number of months you have been employed in your current job.
                                                                        </FormDescription>
                                                                        <FormControl>
                                                                                <Input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        placeholder="Enter number of months"
                                                                                        {...field}
                                                                                />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                        </motion.div>
                                )}
                        </AnimatePresence>

                        {/* Conditional Field: Actively Seeking Work */}
                        <AnimatePresence>
                                {!isUnemployed && (
                                        <motion.div
                                                key="employmentHistory"
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={{
                                                        hidden: { opacity: 0, height: 0, overflow: 'hidden' },
                                                        visible: { opacity: 1, height: 'auto', overflow: 'hidden' },
                                                        exit: { opacity: 0, height: 0, overflow: 'hidden' },
                                                }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                                <FormField
                                                        control={control}
                                                        name="employment.employmentHistory.seekingWork"
                                                        render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                                        <FormControl>
                                                                                <Checkbox
                                                                                        checked={field.value}
                                                                                        onCheckedChange={field.onChange}
                                                                                />
                                                                        </FormControl>
                                                                        <div className="space-y-1 leading-none">
                                                                                <FormLabel>Actively Seeking Work</FormLabel>
                                                                                <FormDescription>
                                                                                        Check if you are currently looking for employment opportunities.
                                                                                </FormDescription>
                                                                        </div>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                        </motion.div>
                                )}
                        </AnimatePresence>
                </div>
        );
}
