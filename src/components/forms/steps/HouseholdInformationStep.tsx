// components/forms/steps/HouseholdInformationStep.tsx

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
import { motion, AnimatePresence } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import type { FormSubmissionData } from '@/lib/types/forms';

export default function HouseholdInformationStep() {
        const { control, watch, setValue } = useFormContext<FormSubmissionData>();

        // Watch the relevant fields for conditional logic
        const householdSize = watch('household.householdSize');
        const numberOfDependents = watch('household.numberOfDependents');

        const hasDependents = parseInt(numberOfDependents || '0', 10) > 0;

        // Ensure that number of dependents does not exceed household size - 1
        useEffect(() => {
                const size = parseInt(householdSize || '1', 10);
                const dependents = parseInt(numberOfDependents || '0', 10);

                if (dependents > size - 1) {
                        setValue('household.numberOfDependents', (size - 1).toString());
                }

                if (size < 1) {
                        setValue('household.householdSize', '1');
                }
        }, [householdSize, numberOfDependents, setValue]);

        // Reset typeOfDependents if there are no dependents
        useEffect(() => {
                if (!hasDependents) {
                        setValue('household.typeOfDependents', '');
                }
        }, [hasDependents, setValue]);

        return (
                <div className="space-y-4">
                        {/* Total Household Size */}
                        <FormField
                                control={control}
                                name="household.householdSize"
                                render={({ field }) => (
                                        <FormItem>
                                                <FormLabel>Total Household Size</FormLabel>
                                                <FormDescription>
                                                        Include all people who live in your household, including yourself.
                                                </FormDescription>
                                                <FormControl>
                                                        <Input
                                                                type="number"
                                                                min="1"
                                                                placeholder="Enter household size"
                                                                {...field}
                                                        />
                                                </FormControl>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />

                        {/* Number of Dependents */}
                        <FormField
                                control={control}
                                name="household.numberOfDependents"
                                render={({ field }) => (
                                        <FormItem>
                                                <FormLabel>Number of Dependents</FormLabel>
                                                <FormDescription>
                                                        Include children under 18 and other dependent family members.
                                                </FormDescription>
                                                <FormControl>
                                                        <Input
                                                                type="number"
                                                                min="0"
                                                                placeholder="Enter number of dependents"
                                                                {...field}
                                                        />
                                                </FormControl>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />

                        {/* Conditional Type of Dependents */}
                        <AnimatePresence>
                                {hasDependents && (
                                        <motion.div
                                                key="typeOfDependents"
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
                                                        name="household.typeOfDependents"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Type of Dependents</FormLabel>
                                                                        <FormDescription>
                                                                                Select the type of dependents you have.
                                                                        </FormDescription>
                                                                        <FormControl>
                                                                                <Select
                                                                                        onValueChange={field.onChange}
                                                                                        value={field.value}
                                                                                >
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Select dependent type" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                <SelectItem value="children_under_18">Children under 18</SelectItem>
                                                                                                <SelectItem value="elderly_parents">Elderly Parents</SelectItem>
                                                                                                <SelectItem value="disabled_family_members">Disabled Family Members</SelectItem>
                                                                                                <SelectItem value="multiple_types">Multiple Types</SelectItem>
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                        </motion.div>
                                )}
                        </AnimatePresence>

                        {/* Total Monthly Household Income */}
                        <FormField
                                control={control}
                                name="household.monthlyIncome"
                                render={({ field }) => (
                                        <FormItem>
                                                <FormLabel>Total Monthly Household Income</FormLabel>
                                                <FormDescription>
                                                        Combined income from all household members.
                                                </FormDescription>
                                                <FormControl>
                                                        <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                placeholder="Enter monthly income"
                                                                {...field}
                                                        />
                                                </FormControl>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />
                </div>
        );
}
